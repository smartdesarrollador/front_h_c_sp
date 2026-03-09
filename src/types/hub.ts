export type ServiceStatus = 'active' | 'suspended' | 'locked' | 'coming_soon'
export type NotificationCategory = 'billing' | 'security' | 'services' | 'system'
export type ReferralStatus = 'active' | 'pending'
export type PlanType = 'free' | 'starter' | 'professional' | 'enterprise'

export interface TenantService {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  status: ServiceStatus
  required_plan?: PlanType
  last_accessed?: string | null
}
