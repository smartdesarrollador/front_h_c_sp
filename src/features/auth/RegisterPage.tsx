import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import AuthLayout from '@/features/auth/components/AuthLayout'
import GoogleOAuthButton from '@/features/auth/components/GoogleOAuthButton'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { usePlans } from '@/features/subscription/hooks/usePlans'

const step1Schema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const step2Schema = z.object({
  organizationName: z.string().min(2, 'Mínimo 2 caracteres'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

const STEP_LABELS = ['Cuenta', 'Empresa', 'Plan', '¡Listo!']

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const preSelectedPlan =
    (location.state as { plan?: string } | null)?.plan ?? 'free'

  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState(preSelectedPlan)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationName: '',
  })
  const { mutateAsync: registerMutate, isPending } = useRegister()
  const { plans: allPlans } = usePlans()
  const registrationPlans = allPlans.filter((p) => p.id !== 'enterprise')

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) })
  const orgName = form2.watch('organizationName') ?? ''
  const subdomainPreview =
    orgName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'tu-empresa'

  async function handleStep1(data: Step1Data) {
    setFormData((prev) => ({
      ...prev,
      email: data.email,
      password: data.password,
    }))
    setStep(2)
  }

  async function handleStep2(data: Step2Data) {
    setFormData((prev) => ({
      ...prev,
      organizationName: data.organizationName,
    }))
    setStep(3)
  }

  async function handleStep3() {
    await registerMutate({
      name: formData.organizationName,
      email: formData.email,
      password: formData.password,
      organization_name: formData.organizationName,
      plan: selectedPlan,
    })
    setStep(4)
  }

  return (
    <AuthLayout>
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        {STEP_LABELS.map((label, idx) => {
          const num = idx + 1
          const isCompleted = step > num
          const isActive = step === num
          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted || isActive
                      ? 'bg-primary-600 text-white'
                      : 'border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : num}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isActive ? 'text-primary-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {idx < STEP_LABELS.length - 1 && (
                <div
                  className={`h-px w-8 mx-2 mb-5 ${
                    step > num ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Crea tu cuenta
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              {...form1.register('email')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="tu@empresa.com"
            />
            {form1.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form1.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...form1.register('password')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Mínimo 8 caracteres"
            />
            {form1.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form1.formState.errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              {...form1.register('confirmPassword')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Repite tu contraseña"
            />
            {form1.formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {form1.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Continuar
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">o</span>
            </div>
          </div>
          <GoogleOAuthButton text="Registrarse con Google" />
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </form>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tu organización
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la organización
            </label>
            <input
              type="text"
              {...form2.register('organizationName')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Mi Empresa S.A."
            />
            {form2.formState.errors.organizationName && (
              <p className="text-red-500 text-sm mt-1">
                {form2.formState.errors.organizationName.message}
              </p>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm">
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              Tu subdominio será:
            </p>
            <p
              className="font-mono font-medium text-primary-600 dark:text-primary-400"
              data-testid="subdomain-preview"
            >
              {subdomainPreview}.hub.app
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Atrás
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        </form>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Elige tu plan
          </h2>
          <div className="space-y-3">
            {registrationPlans.map((plan) => (
              <label
                key={plan.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedPlan === plan.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selectedPlan === plan.id}
                  onChange={() => setSelectedPlan(plan.id)}
                  className="text-primary-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {plan.displayName}
                    </span>
                    {plan.popular && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${plan.priceMonthly}/mes
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handleStep3}
              disabled={isPending}
              className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Cuenta creada!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Tu organización <strong>{formData.organizationName}</strong> está lista.
              Inicia sesión para comenzar.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Ir al inicio de sesión
          </button>
        </div>
      )}
    </AuthLayout>
  )
}
