import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

export default function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <Outlet />
    </Suspense>
  )
}
