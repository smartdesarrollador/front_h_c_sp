import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PlanUsageBannerProps {
  currentUsers: number
  limitUsers: number | null
}

export function PlanUsageBanner({ currentUsers, limitUsers }: PlanUsageBannerProps) {
  if (limitUsers === null || currentUsers / limitUsers < 0.8) return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800">
          Límite de usuarios próximo ({currentUsers}/{limitUsers})
        </p>
        <p className="text-sm text-yellow-700 mt-0.5">
          Estás usando el {Math.round((currentUsers / limitUsers) * 100)}% de tu límite de
          usuarios.
        </p>
      </div>
      <Link
        to="/subscription"
        className="text-sm font-medium text-yellow-800 underline hover:text-yellow-900 shrink-0"
      >
        Actualizar Plan
      </Link>
    </div>
  )
}
