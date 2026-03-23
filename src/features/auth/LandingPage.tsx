import { useNavigate, Navigate } from 'react-router-dom'
import { Building2, Monitor, Globe, Laptop, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { usePlans } from '@/features/subscription/hooks/usePlans'

const FEATURES = [
  {
    icon: Monitor,
    title: 'Workspace',
    description: 'Gestiona proyectos, tareas y tu equipo desde un único lugar colaborativo.',
  },
  {
    icon: Globe,
    title: 'Vista Digital',
    description: 'Publica y gestiona tus servicios digitales con un potente CMS integrado.',
  },
  {
    icon: Laptop,
    title: 'App Desktop',
    description: 'Accede a todas tus herramientas desde una aplicación nativa multiplataforma.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { plans } = usePlans()
  const landingPlans = plans.filter((p) => p.id !== 'enterprise')

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  function scrollToPricing() {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Hub de Servicios</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Todo lo que tu negocio necesita,{' '}
            <span className="text-primary-600">en un solo lugar</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Gestiona tu equipo, proyectos y servicios digitales desde una plataforma unificada con roles y permisos granulares.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register', { state: { plan: 'free' } })}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors"
            >
              Comenzar gratis
            </button>
            <button
              onClick={scrollToPricing}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Ver planes
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Un ecosistema completo de servicios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm">
                  <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Planes para cada etapa
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            Comienza gratis y escala cuando lo necesites
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {landingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-primary-600 text-white shadow-xl ring-2 ring-primary-600'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      Más popular
                    </span>
                  </div>
                )}
                <h3
                  className={`text-xl font-bold mb-1 ${
                    plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {plan.displayName}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    plan.popular ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    ${plan.priceMonthly}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-primary-100' : 'text-gray-500'}`}>
                    /mes
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.filter((f) => f.included).map((f) => (
                    <li key={f.label} className="flex items-center gap-2 text-sm">
                      <Check
                        className={`h-4 w-4 flex-shrink-0 ${
                          plan.popular ? 'text-primary-200' : 'text-primary-600'
                        }`}
                      />
                      <span
                        className={
                          plan.popular ? 'text-primary-100' : 'text-gray-600 dark:text-gray-300'
                        }
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register', { state: { plan: plan.id } })}
                  className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-white text-primary-600 hover:bg-primary-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {plan.id === 'free' ? 'Comenzar gratis' : `Empezar con ${plan.displayName}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Hub de Servicios. Todos los derechos reservados.
      </footer>
    </div>
  )
}
