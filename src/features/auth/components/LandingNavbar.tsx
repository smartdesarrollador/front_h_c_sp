import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Menu, X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { publicClient } from '@/lib/axios'

const SUBDOMAIN = import.meta.env.VITE_TENANT_SUBDOMAIN as string | undefined

interface PublicBranding {
  name: string | null
  logo_url: string | null
  favicon_url: string | null
  primary_color: string | null
}

interface NavLink {
  label: string
  onClick: () => void
}

interface LandingNavbarProps {
  navLinks?: NavLink[]
}

export default function LandingNavbar({ navLinks = [] }: LandingNavbarProps) {
  const navigate = useNavigate()
  const { language, setLanguage } = useUiStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [branding, setBranding] = useState<PublicBranding | null>(null)

  useEffect(() => {
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(234,241,248,0.82)] dark:bg-[#0F2D45]/80 backdrop-blur-md border-b border-[rgba(11,39,64,0.10)] dark:border-[rgba(234,241,248,0.10)]">
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
            <span className="text-lg font-bold text-[#0B2740] dark:text-[#EAF1F8]">
              {branding?.name ?? 'Hub de Servicios'}
            </span>
          </div>
        )}

        {/* Desktop nav links */}
        {navLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.onClick}
                className="text-sm text-[rgba(11,39,64,0.66)] hover:text-[#0B2740] dark:text-[rgba(234,241,248,0.72)] dark:hover:text-[#EAF1F8] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

        {/* Right side: language toggle + login */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center bg-[rgba(11,39,64,0.10)] dark:bg-[rgba(234,241,248,0.10)] rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 rounded-full transition-colors ${
                language === 'es'
                  ? 'bg-primary-600 text-white'
                  : 'text-[rgba(11,39,64,0.66)] hover:text-[#0B2740] dark:text-[rgba(234,241,248,0.72)] dark:hover:text-[#EAF1F8]'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full transition-colors ${
                language === 'en'
                  ? 'bg-primary-600 text-white'
                  : 'text-[rgba(11,39,64,0.66)] hover:text-[#0B2740] dark:text-[rgba(234,241,248,0.72)] dark:hover:text-[#EAF1F8]'
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary-600/30"
          >
            Iniciar sesión
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Abrir menú"
          className="md:hidden text-[rgba(11,39,64,0.66)] hover:text-[#0B2740] dark:text-[rgba(234,241,248,0.72)] dark:hover:text-[#EAF1F8] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#DDE5EE] dark:bg-[#0F2D45] border-t border-[rgba(11,39,64,0.10)] dark:border-[rgba(234,241,248,0.10)] px-4 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { link.onClick(); setMobileOpen(false) }}
              className="text-[#0B2740] hover:text-primary-600 dark:text-[rgba(234,241,248,0.72)] dark:hover:text-[#EAF1F8] text-sm text-left transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setLanguage('es')}
              className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors ${
                language === 'es'
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-[rgba(11,39,64,0.17)] dark:border-[rgba(234,241,248,0.18)] text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] hover:text-[#0B2740] dark:hover:text-[#EAF1F8]'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors ${
                language === 'en'
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-[rgba(11,39,64,0.17)] dark:border-[rgba(234,241,248,0.18)] text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] hover:text-[#0B2740] dark:hover:text-[#EAF1F8]'
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium w-full text-center transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      )}
    </nav>
  )
}
