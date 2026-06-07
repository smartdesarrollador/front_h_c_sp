import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  Monitor,
  Globe,
  LayoutDashboard,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { usePlans } from '@/features/subscription/hooks/usePlans'
import LandingNavbar from './components/LandingNavbar'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('landing')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { plans } = usePlans()

  const landingPlans = plans.filter((p) => p.id !== 'enterprise')

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const navLinks = [
    { label: t('navFeatures'), onClick: () => scrollTo('features') },
    { label: t('navPricing'),  onClick: () => scrollTo('pricing')  },
  ]

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
    <div className="min-h-screen bg-[#EAF1F8] dark:bg-[#071D2E] text-[#0B2740] dark:text-[#EAF1F8]">
      {/* ── NAVBAR ── */}
      <LandingNavbar navLinks={navLinks} />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        {/* Blue radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 85% 55% at 50% -5%, rgba(28,128,242,0.18), transparent)',
          }}
        />
        {/* Dot-grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(28,128,242,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center border border-primary-600/30 bg-primary-600/10 text-primary-700 dark:text-primary-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
            {t('badge')}
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#0B2740] dark:text-[#EAF1F8] mb-5 leading-tight tracking-tight">
            {t('heroTitle')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              {t('heroHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] mb-10 max-w-2xl mx-auto leading-relaxed">
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
              className="w-full sm:w-auto border border-[rgba(11,39,64,0.17)] dark:border-[rgba(234,241,248,0.18)] hover:border-primary-600 text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] hover:text-primary-600 dark:hover:text-primary-400 px-8 py-3 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5"
            >
              {t('ctaDemo')}
            </button>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#0B2740] dark:text-[#EAF1F8]">
                  {stat.value}
                </div>
                <div className="text-xs text-[rgba(11,39,64,0.45)] dark:text-[rgba(234,241,248,0.50)] mt-1.5 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 bg-white dark:bg-[#0F2D45]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2740] dark:text-[#EAF1F8] mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] max-w-xl mx-auto">
              {t('featuresSub')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group bg-[#EAF1F8] dark:bg-[#071D2E] border border-[rgba(11,39,64,0.10)] dark:border-[rgba(234,241,248,0.10)] rounded-2xl p-8 hover:border-primary-600/40 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-600/10 dark:bg-primary-600/15 flex items-center justify-center mb-6 group-hover:bg-primary-600/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0B2740] dark:text-[#EAF1F8] mb-3">{f.title}</h3>
                  <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── WHY US (on-dark) ── */}
      <section className="py-24 px-4 bg-[#0B2740] dark:bg-[#071D2E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#EAF1F8] mb-4">
              {t('whyTitle')}
            </h2>
            <p className="text-[rgba(234,241,248,0.72)]">{t('whySub')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {whyUs.map((w) => {
              const Icon = w.icon
              return (
                <div key={w.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center mt-0.5">
                    <Icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#EAF1F8] mb-2">{w.title}</h3>
                    <p className="text-[rgba(234,241,248,0.72)] text-sm leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 bg-[#DDE5EE] dark:bg-[#0F2D45]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2740] dark:text-[#EAF1F8] mb-4">
              {t('pricingTitle')}
            </h2>
            <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)]">
              {t('pricingSub')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {landingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary-600 to-primary-800 shadow-2xl shadow-primary-600/30 ring-1 ring-primary-500/50'
                    : 'bg-white dark:bg-[#071D2E] border border-[rgba(11,39,64,0.10)] dark:border-[rgba(234,241,248,0.10)] hover:border-primary-600/40 transition-colors'
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
                  <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-[#0B2740] dark:text-[#EAF1F8]'}`}>
                    {plan.displayName}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-primary-200' : 'text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)]'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-[#0B2740] dark:text-[#EAF1F8]'}`}>
                      ${plan.priceMonthly}
                    </span>
                    <span className={`text-sm ml-1 ${plan.popular ? 'text-primary-200' : 'text-[rgba(11,39,64,0.45)] dark:text-[rgba(234,241,248,0.50)]'}`}>
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
                              plan.popular ? 'text-primary-200' : 'text-primary-600 dark:text-primary-400'
                            }`}
                          />
                          <span className={plan.popular ? 'text-primary-100' : 'text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)]'}>
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

      {/* ── FOOTER (on-dark) ── */}
      <footer className="py-10 px-4 border-t border-[rgba(234,241,248,0.12)] bg-[#0B2740] dark:bg-[#071D2E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1 rounded-md">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-[#EAF1F8]">Hub de Servicios</span>
          </div>
          <p className="text-xs text-[rgba(234,241,248,0.50)]">
            © {new Date().getFullYear()} Hub de Servicios. {t('footerRights')}
          </p>
        </div>
      </footer>
    </div>
  )
}
