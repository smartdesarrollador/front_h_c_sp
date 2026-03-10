export type PaymentMethodType =
  | 'card'
  | 'paypal'
  | 'mercadopago'
  | 'yape'
  | 'plin'
  | 'nequi'
  | 'daviplata'

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  brand: string
  last4: string | null
  exp_month: number | null
  exp_year: number | null
  is_default: boolean
  card_type: string | null
  phone_number: string | null
}

export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible'

export interface Invoice {
  id: string
  number: string
  amount: number
  currency: string
  status: InvoiceStatus
  created_at: string
  period_start: string
  period_end: string
  pdf_url: string | null
}
