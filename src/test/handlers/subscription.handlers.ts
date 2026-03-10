import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

const mockSubscription = {
  id: 'sub1',
  plan: 'professional',
  plan_name: 'Professional',
  status: 'active',
  current_period_end: '2026-04-01T00:00:00Z',
  cancel_at_period_end: false,
  mrr: 79,
  trial_ends_at: null,
  usage: {
    users: { current: 5, limit: 20 },
    storage_gb: { current: 2, limit: 50 },
    api_calls: { current: 1000, limit: 10000 },
  },
}

export const subscriptionHandlers = [
  http.get(`${API}/admin/subscriptions/current/`, () => HttpResponse.json(mockSubscription)),

  http.post(`${API}/admin/subscriptions/upgrade/`, () =>
    HttpResponse.json({ message: 'Upgraded successfully' }),
  ),

  http.post(`${API}/admin/subscriptions/cancel/`, () =>
    HttpResponse.json({ message: 'Cancelled successfully' }),
  ),
]
