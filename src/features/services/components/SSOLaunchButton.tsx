import { Loader2, ArrowUpRight } from 'lucide-react'
import { useSSO } from '../hooks/useSSO'

interface SSOLaunchButtonProps {
  serviceSlug: string
}

export function SSOLaunchButton({ serviceSlug }: SSOLaunchButtonProps) {
  const { mutate, isPending, isError } = useSSO()

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => mutate({ service: serviceSlug })}
        disabled={isPending}
        className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Abriendo...
          </>
        ) : (
          <>
            Abrir
            <ArrowUpRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
      {isError && (
        <p className="text-xs text-red-500">Error al iniciar sesión. Intenta de nuevo.</p>
      )}
    </div>
  )
}
