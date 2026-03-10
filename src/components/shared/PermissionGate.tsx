import type { ReactNode } from 'react'
import { usePermissions } from '@/hooks/usePermissions'

interface Props {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

function PermissionGate({ permission, children, fallback = null }: Props) {
  const { hasPermission } = usePermissions()
  if (hasPermission(permission)) return <>{children}</>
  return <>{fallback}</>
}

export default PermissionGate
