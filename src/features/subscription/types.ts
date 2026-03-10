export type PlanType = 'free' | 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
export type BillingCycle = 'monthly' | 'annual'

export interface SubscriptionUsage {
  users: { current: number; limit: number | null }
  storage: { current_gb: number; limit_gb: number | null }
  services: { current: number; limit: number | null }
}

export interface CurrentSubscription {
  id: string
  plan: PlanType
  plan_display: string
  status: SubscriptionStatus
  billing_cycle: BillingCycle
  cancel_at_period_end: boolean
  trial_end: string | null
  current_period_end: string | null
  mrr: number
  usage: SubscriptionUsage
}

export interface PlanFeature {
  label: string
  included: boolean
}

export interface PlanData {
  id: PlanType
  displayName: string
  priceMonthly: number
  priceAnnual: number
  description: string
  popular: boolean
  features: PlanFeature[]
}
