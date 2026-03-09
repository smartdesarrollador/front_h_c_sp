export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
  status: 'active' | 'inactive' | 'pending'
  mfaEnabled: boolean
  tenantId: string
  lastLogin: string | null
  createdAt: string
}

export interface Tenant {
  id: string
  name: string
  subdomain: string
  plan: string
  primaryColor?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
  tenant: Tenant
}

export interface MFALoginResponse {
  mfa_required: true
  mfa_token: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  organization_name: string
  plan: 'free' | 'starter' | 'professional'
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}
