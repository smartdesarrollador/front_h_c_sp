import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

const mockReferralData = {
  referral_code: 'ACME-REF-123',
  stats: {
    total_referrals: 3,
    converted: 2,
    pending: 1,
    total_earned: 150,
  },
  history: [
    {
      id: 'r1',
      email: 'referred@example.com',
      status: 'converted',
      earned: 50,
      created_at: '2026-02-01T00:00:00Z',
    },
  ],
}

const mockReferralSummary = {
  referral_code: 'ACME-REF-123',
  total_referrals: 3,
  total_earned: 150,
  pending_earnings: 50,
}

export const referralsHandlers = [
  http.get(`${API}/app/referrals/`, () => HttpResponse.json(mockReferralData)),

  http.get(`${API}/app/referrals/summary/`, () => HttpResponse.json(mockReferralSummary)),
]
