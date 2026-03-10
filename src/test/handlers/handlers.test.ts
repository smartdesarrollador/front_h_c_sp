import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../server'
import { publicClient, apiClient } from '@/lib/axios'

describe('MSW handlers infrastructure', () => {
  it('POST /auth/login/ returns access_token via MSW', async () => {
    const { data } = await publicClient.post('/auth/login/', {
      email: 'user@acme.com',
      password: 'password123',
    })
    expect(data.access_token).toBe('mock-hub-access-token')
    expect(data.user.email).toBe('user@acme.com')
  })

  it('GET /app/services/active/ returns services array', async () => {
    const { data } = await apiClient.get('/app/services/active/')
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('server.use() override funciona', async () => {
    server.use(http.get('http://localhost:8000/app/services/active/', () => HttpResponse.json([])))
    const { data } = await apiClient.get('/app/services/active/')
    expect(data).toEqual([])
  })

  it('POST /auth/register/ returns 201', async () => {
    const { status } = await publicClient.post('/auth/register/', {
      email: 'new@test.com',
      password: 'pass1234',
      name: 'New User',
      organization_name: 'New Org',
      plan: 'free',
    })
    expect(status).toBe(201)
  })

  it('GET /admin/subscriptions/current/ returns subscription', async () => {
    const { data } = await apiClient.get('/admin/subscriptions/current/')
    expect(data.plan).toBe('professional')
    expect(data.status).toBe('active')
  })

  it('GET /support/tickets/ returns tickets with count', async () => {
    const { data } = await apiClient.get('/support/tickets/')
    expect(Array.isArray(data.results)).toBe(true)
    expect(typeof data.count).toBe('number')
  })
})
