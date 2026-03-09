import type { ReactNode } from 'react'
import { Building2 } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Hub de Servicios</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
