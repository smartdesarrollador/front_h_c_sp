import i18n, { type InitOptions, type ResourceLanguage } from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es'
import en from './locales/en'

const NAMESPACES = [
  'navbar', 'landing', 'login', 'register', 'dashboard',
  'serviceCard', 'serviceCatalog', 'subscription', 'billing',
  'notifications', 'team', 'referrals', 'support', 'profile', 'common',
] as const

const buildResources = (locale: Record<string, unknown>): ResourceLanguage =>
  Object.fromEntries(NAMESPACES.map((ns) => [ns, locale[ns] as ResourceLanguage]))

const options: InitOptions = {
  resources: {
    es: buildResources(es as unknown as Record<string, unknown>),
    en: buildResources(en as unknown as Record<string, unknown>),
  },
  lng: (() => { try { return localStorage.getItem('hub-lang') ?? 'es' } catch { return 'es' } })(),
  fallbackLng: 'es',
  defaultNS: 'common',
  ns: NAMESPACES,
  interpolation: { escapeValue: false },
}

i18n.use(initReactI18next).init(options)

export default i18n
