import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  Monitor,
  Globe,
  LayoutDashboard,
  Check,
  ShieldCheck,
  Zap,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { usePlans } from '@/features/subscription/hooks/usePlans'
import { publicClient } from '@/lib/axios'

const SUBDOMAIN = import.meta.env.VITE_TENANT_SUBDOMAIN as string | undefined

interface PublicBranding {
  name: string | null
  logo_url: string | null
  favicon_url: string | null
  primary_color: string | null
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('landing')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { language, setLanguage } = useUiStore()
  const { plans } = usePlans()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [branding, setBranding] = useState<PublicBranding | null>(null)

  useEffect(() => {
    // Priority: env var → localStorage (previous session) → skip
    let subdomain = SUBDOMAIN
    if (!subdomain) {
      try {
        const stored = localStorage.getItem('hub-authTenant')
        if (stored) subdomain = JSON.parse(stored)?.subdomain
      } catch {}
    }
    if (!subdomain) return

    publicClient
      .get<PublicBranding>(`/public/branding/?subdomain=${subdomain}`)
      .then(({ data }) => {
        setBranding(data)
        if (data.favicon_url) {
          let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
          if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
          }
          link.href = data.favicon_url
        }
      })
      .catch(() => {})
  }, [])

  const landingPlans = plans.filter((p) => p.id !== 'enterprise')

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ]

  const features = [
    { icon: LayoutDashboard, title: t('workspaceTitle'), desc: t('workspaceDesc') },
    { icon: Globe, title: t('vistaTitle'), desc: t('vistaDesc') },
    { icon: Monitor, title: t('desktopTitle'), desc: t('desktopDesc') },
  ]

  const whyUs = [
    { icon: ShieldCheck, title: t('why1Title'), desc: t('why1Desc') },
    { icon: Building2, title: t('why2Title'), desc: t('why2Desc') },
    { icon: Zap, title: t('why3Title'), desc: t('why3Desc') },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#F8FAFC]">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          {branding?.logo_url ? (
            <img
              src={branding.logo_url}
              alt={branding.name ?? 'Logo'}
              className="h-9 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white">
                {branding?.name ?? 'Hub de Servicios'}
              </span>
            </div>
          )}

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('features')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t('navFeatures')}
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t('navPricing')}
            </button>
          </div>

          {/* Right side: language toggle + login */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center bg-white/10 rounded-full p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  language === 'es'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  language === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t('ctaLogin')}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Abrir menú"
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#111827] border-t border-white/10 px-4 py-5 flex flex-col gap-4">
            <button
              onClick={() => { scrollTo('features'); setMobileOpen(false) }}
              className="text-gray-300 text-sm text-left hover:text-white"
            >
              {t('navFeatures')}
            </button>
            <button
              onClick={() => { scrollTo('pricing'); setMobileOpen(false) }}
              className="text-gray-300 text-sm text-left hover:text-white"
            >
              {t('navPricing')}
            </button>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setLanguage('es')}
                className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors ${
                  language === 'es'
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-white/20 text-gray-400 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-white/20 text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium w-full text-center transition-colors"
            >
              {t('ctaLogin')}
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        {/* Violet radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 85% 55% at 50% -5%, rgba(124,58,237,0.28), transparent)',
          }}
        />
        {/* Dot-grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(167,139,250,0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center border border-primary-600/50 bg-primary-600/10 text-primary-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
            {t('badge')}
          </div>

          {/* Org name in hero (shown when branding is loaded) */}
          {branding?.name && (
            <p className="text-2xl sm:text-3xl font-bold text-white/90 mb-4 tracking-tight">
              {branding.name}
            </p>
          )}

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            {t('heroTitle')}{' '}
            <span className="text-primary-400">{t('heroHighlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register', { state: { plan: 'free' } })}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-0.5"
            >
              {t('ctaStart')}
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="w-full sm:w-auto border border-white/20 hover:border-primary-400/50 text-gray-300 hover:text-white px-8 py-3 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5"
            >
              {t('ctaDemo')}
            </button>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1.5 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">{t('featuresSub')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group bg-[#0B0F1A] border border-white/10 rounded-2xl p-8 hover:border-primary-600/40 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-600/15 flex items-center justify-center mb-6 group-hover:bg-primary-600/25 transition-colors">
                    <Icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-24 px-4 bg-[#0B0F1A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('whyTitle')}
            </h2>
            <p className="text-gray-400">{t('whySub')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {whyUs.map((w) => {
              const Icon = w.icon
              return (
                <div key={w.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-600/15 flex items-center justify-center mt-0.5">
                    <Icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{w.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('pricingTitle')}
            </h2>
            <p className="text-gray-400">{t('pricingSub')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {landingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary-600 to-primary-800 shadow-2xl shadow-primary-600/30 ring-1 ring-primary-500/50'
                    : 'bg-[#0B0F1A] border border-white/10 hover:border-primary-600/30 transition-colors'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {t('mostPopular')}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.displayName}</h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-primary-200' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-bold text-white">${plan.priceMonthly}</span>
                    <span className={`text-sm ml-1 ${plan.popular ? 'text-primary-200' : 'text-gray-500'}`}>
                      {t('perMonth')}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features
                      .filter((f) => f.included)
                      .map((f) => (
                        <li key={f.label} className="flex items-center gap-2.5 text-sm">
                          <Check
                            className={`h-4 w-4 flex-shrink-0 ${
                              plan.popular ? 'text-primary-200' : 'text-primary-400'
                            }`}
                          />
                          <span className={plan.popular ? 'text-primary-100' : 'text-gray-300'}>
                            {f.label}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/register', { state: { plan: plan.id } })}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-white text-primary-700 hover:bg-primary-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20'
                  }`}
                >
                  {plan.id === 'free'
                    ? t('freeCta')
                    : plan.id === 'starter'
                      ? t('starterCta')
                      : t('proCta')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4 border-t border-white/10 bg-[#0B0F1A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1 rounded-md">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-white">Hub de Servicios</span>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Hub de Servicios. {t('footerRights')}
          </p>
        </div>
      </footer>
    </div>
  )
}
