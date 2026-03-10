export interface ReferralStats {
  referred: number
  credits_earned: number
  available_credits: number
}

export type ReferralStatus = 'active' | 'pending'

export interface ReferralItem {
  id: string
  tenant_name: string
  status: ReferralStatus
  credit_amount: number
  activated_at: string | null
  created_at: string
}

export interface ReferralDashboard {
  code: string
  referral_url: string
  stats: ReferralStats
  referrals: ReferralItem[]
}
