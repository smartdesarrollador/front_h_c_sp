import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

const mockUser = {
  id: 'u1',
  email: 'user@acme.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  roles: ['Owner'],
  permissions: [],
  status: 'active',
  mfaEnabled: false,
  tenantId: 't1',
  lastLogin: null,
  createdAt: '2026-01-01T00:00:00Z',
}

const mockTenant = {
  id: 't1',
  name: 'Acme Corp',
  subdomain: 'acme',
  plan: 'professional',
}

export const authHandlers = [
  http.post(`${API}/auth/login/`, () =>
    HttpResponse.json({
      access_token: 'mock-hub-access-token',
      refresh_token: 'mock-hub-refresh-token',
      user: mockUser,
      tenant: mockTenant,
    }),
  ),

  http.post(`${API}/auth/register/`, () =>
    HttpResponse.json({ message: 'Registration successful' }, { status: 201 }),
  ),

  http.post(`${API}/auth/token/refresh/`, () =>
    HttpResponse.json({
      access_token: 'mock-hub-access-token-refreshed',
      refresh_token: 'mock-hub-refresh-token-refreshed',
    }),
  ),

  http.post(`${API}/auth/logout/`, () => new HttpResponse(null, { status: 204 })),

  http.post(`${API}/auth/forgot-password/`, () => HttpResponse.json({ message: 'Email sent' })),
]
