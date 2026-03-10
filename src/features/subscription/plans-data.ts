import type { PlanData, PlanType } from './types'

export const PLANS: PlanData[] = [
  {
    id: 'free',
    displayName: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Para explorar la plataforma',
    popular: false,
    features: [
      { label: 'Workspace (acceso limitado)', included: true },
      { label: 'Vista Digital', included: false },
      { label: '1 usuario', included: true },
      { label: 'Soporte por email', included: true },
      { label: 'Analytics Pro', included: false },
      { label: 'Desktop App', included: false },
    ],
  },
  {
    id: 'starter',
    displayName: 'Starter',
    priceMonthly: 29,
    priceAnnual: 313,
    description: 'Para profesionales y pequeños equipos',
    popular: false,
    features: [
      { label: 'Workspace completo', included: true },
      { label: 'Vista Digital', included: true },
      { label: 'Hasta 5 usuarios', included: true },
      { label: 'Soporte prioritario', included: true },
      { label: 'Analytics Pro', included: false },
      { label: 'Desktop App', included: false },
    ],
  },
  {
    id: 'professional',
    displayName: 'Professional',
    priceMonthly: 79,
    priceAnnual: 854,
    description: 'Para equipos que necesitan más poder',
    popular: true,
    features: [
      { label: 'Workspace completo', included: true },
      { label: 'Vista Digital', included: true },
      { label: 'Hasta 20 usuarios', included: true },
      { label: 'Soporte 24/7', included: true },
      { label: 'Analytics Pro', included: true },
      { label: 'Desktop App', included: true },
    ],
  },
  {
    id: 'enterprise',
    displayName: 'Enterprise',
    priceMonthly: 199,
    priceAnnual: 2149,
    description: 'Para organizaciones con necesidades avanzadas',
    popular: false,
    features: [
      { label: 'Workspace completo', included: true },
      { label: 'Vista Digital', included: true },
      { label: 'Usuarios ilimitados', included: true },
      { label: 'Soporte dedicado', included: true },
      { label: 'Analytics Pro', included: true },
      { label: 'Desktop App', included: true },
    ],
  },
]

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'professional', 'enterprise']

export function isUpgrade(current: PlanType, target: PlanType): boolean {
  return PLAN_ORDER.indexOf(target) > PLAN_ORDER.indexOf(current)
}
