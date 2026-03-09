import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { apiClient, publicClient } from '../api'
import { useAuthStore } from '@/store/authStore'

vi.mock('@/store/authStore')

const mockSetAccessToken = vi.fn()
const mockClearAuth = vi.fn()

function mockStore(overrides: { accessToken?: string | null; subdomain?: string | null } = {}) {
  const { accessToken = 'test-token', subdomain = 'acme' } = overrides
  vi.mocked(useAuthStore).mockReturnValue({
    accessToken,
    tenant: subdomain ? { id: '1', name: 'Acme', subdomain, plan: 'starter' } : null,
    user: null,
    isAuthenticated: !!accessToken,
    setUser: vi.fn(),
    setTenant: vi.fn(),
    setAccessToken: mockSetAccessToken,
    clearAuth: mockClearAuth,
  } as never)

  // Also mock getState for interceptors
  vi.mocked(useAuthStore).getState = vi.fn().mockReturnValue({
    accessToken,
    tenant: subdomain ? { id: '1', name: 'Acme', subdomain, plan: 'starter' } : null,
    setAccessToken: mockSetAccessToken,
    clearAuth: mockClearAuth,
  })
}

describe('apiClient interceptors', () => {
  let mock: MockAdapter
  let publicMock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(apiClient)
    publicMock = new MockAdapter(publicClient)
    vi.clearAllMocks()
  })

  afterEach(() => {
    mock.restore()
    publicMock.restore()
  })

  it('inyecta Authorization header cuando hay accessToken', async () => {
    mockStore({ accessToken: 'my-access-token' })
    let capturedHeaders: Record<string, string> = {}
    mock.onGet('/test').reply((config) => {
      capturedHeaders = config.headers as Record<string, string>
      return [200, {}]
    })
    await apiClient.get('/test')
    expect(capturedHeaders['Authorization']).toBe('Bearer my-access-token')
  })

  it('inyecta X-Tenant-Slug cuando hay tenant', async () => {
    mockStore({ subdomain: 'my-company' })
    let capturedHeaders: Record<string, string> = {}
    mock.onGet('/test').reply((config) => {
      capturedHeaders = config.headers as Record<string, string>
      return [200, {}]
    })
    await apiClient.get('/test')
    expect(capturedHeaders['X-Tenant-Slug']).toBe('my-company')
  })

  it('NO inyecta X-Tenant-Slug sin tenant', async () => {
    mockStore({ subdomain: null })
    let capturedHeaders: Record<string, string> = {}
    mock.onGet('/test').reply((config) => {
      capturedHeaders = config.headers as Record<string, string>
      return [200, {}]
    })
    await apiClient.get('/test')
    expect(capturedHeaders['X-Tenant-Slug']).toBeUndefined()
  })

  it('llama clearAuth en 401 sin refreshToken en localStorage', async () => {
    mockStore()
    localStorage.removeItem('hub-refreshToken')
    mock.onGet('/protected').reply(401)
    await expect(apiClient.get('/protected')).rejects.toThrow()
    expect(mockClearAuth).toHaveBeenCalled()
  })

  it('reintenta request tras refresh exitoso', async () => {
    mockStore({ accessToken: 'old-token' })
    localStorage.setItem('hub-refreshToken', 'valid-refresh')

    let callCount = 0
    mock.onGet('/protected').reply(() => {
      callCount++
      if (callCount === 1) return [401, { detail: 'token expired' }]
      return [200, { data: 'ok' }]
    })

    publicMock.onPost('/auth/token/refresh/').reply(200, {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    })

    const response = await apiClient.get('/protected')
    expect(response.data).toEqual({ data: 'ok' })
    expect(mockSetAccessToken).toHaveBeenCalledWith('new-access-token')
    expect(localStorage.getItem('hub-refreshToken')).toBe('new-refresh-token')

    localStorage.removeItem('hub-refreshToken')
  })
})
