import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

const mockPaymentMethod = {
  id: 'pm1',
  brand: 'visa',
  last4: '4242',
  exp_month: 12,
  exp_year: 2027,
  is_default: true,
  card_type: 'credit',
}

const mockInvoice = {
  id: 'inv1',
  number: 'INV-001',
  amount: 79,
  currency: 'usd',
  status: 'paid',
  created_at: '2026-03-01T00:00:00Z',
  pdf_url: 'https://example.com/invoice.pdf',
}

export const billingHandlers = [
  http.get(`${API}/admin/billing/payment-methods/`, () =>
    HttpResponse.json([mockPaymentMethod]),
  ),

  http.post(`${API}/admin/billing/payment-methods/`, () =>
    HttpResponse.json(mockPaymentMethod, { status: 201 }),
  ),

  http.patch(`${API}/admin/billing/payment-methods/:id/`, () =>
    HttpResponse.json(mockPaymentMethod),
  ),

  http.delete(`${API}/admin/billing/payment-methods/:id/`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  http.get(`${API}/admin/billing/invoices/`, () => HttpResponse.json([mockInvoice])),
]
