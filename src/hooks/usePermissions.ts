import { useAuthStore } from '@/store/authStore'

export interface UsePermissionsReturn {
  hasPermission: (codename: string) => boolean
  hasRole: (roleName: string) => boolean
  isOwner: boolean
  isAdmin: boolean
  canManageBilling: boolean
  canUpgradePlan: boolean
  getPrimaryRole: () => string
  getRoleColor: () => string
}

const ROLE_COLORS: Record<string, string> = {
  Owner: '#dc2626',
  OrgAdmin: '#dc2626',
  'Service Manager': '#ea580c',
  Member: '#3b82f6',
  Viewer: '#6b7280',
  Guest: '#6b7280',
}

export function usePermissions(): UsePermissionsReturn {
  const user = useAuthStore((s) => s.user)
  const plan = useAuthStore((s) => s.tenant?.plan ?? 'free')

  const hasPermission = (codename: string): boolean =>
    user?.permissions.includes(codename) ?? false

  const hasRole = (roleName: string): boolean =>
    user?.roles.includes(roleName) ?? false

  const isOwner = hasRole('Owner')
  const isAdmin = isOwner || hasRole('OrgAdmin')
  const canManageBilling = isAdmin || hasPermission('subscriptions.view_billing')
  const canUpgradePlan = plan === 'free' || plan === 'starter'

  const getPrimaryRole = (): string => user?.roles[0] ?? 'Guest'

  const getRoleColor = (): string => ROLE_COLORS[getPrimaryRole()] ?? '#6b7280'

  return {
    hasPermission,
    hasRole,
    isOwner,
    isAdmin,
    canManageBilling,
    canUpgradePlan,
    getPrimaryRole,
    getRoleColor,
  }
}
