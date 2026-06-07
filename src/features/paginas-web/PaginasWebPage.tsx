import { useNavigate } from 'react-router-dom'
import {
  Globe,
  ShoppingCart,
  LayoutTemplate,
  BookOpen,
  Briefcase,
  Building2,
  ShieldCheck,
  Zap,
  Headphones,
  ArrowRight,
  Check,
} from 'lucide-react'
import LandingNavbar from '@/features/auth/components/LandingNavbar'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const SERVICES = [
  {
    icon: Globe,
    title: 'Portales Web',
    desc: 'Plataformas robustas con áreas privadas, gestión de usuarios y contenido dinámico para tu negocio o comunidad.',
  },
  {
    icon: ShoppingCart,
    title: 'Tiendas Virtuales',
    desc: 'E-commerce completo con carrito, pagos online, gestión de inventario y panel de pedidos para vender 24/7.',
  },
  {
    icon: LayoutTemplate,
    title: 'Landing Pages',
    desc: 'Páginas de alta conversión para campañas, lanzamientos de productos o captación de leads con diseño impactante.',
  },
  {
    icon: BookOpen,
    title: 'Blogs & Contenido',
    desc: 'Plataformas de contenido optimizadas para SEO, con editor visual, categorías y suscripciones integradas.',
  },
  {
    icon: Briefcase,
    title: 'Portafolios',
    desc: 'Showcases profesionales para creativos, agencias y freelancers que quieren destacar su trabajo en línea.',
  },
  {
    icon: Building2,
    title: 'Páginas Institucionales',
    desc: 'Sitios corporativos que transmiten confianza, con secciones de servicios, equipo, contacto y valores de marca.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Consulta gratuita',
    desc: 'Analizamos tus objetivos, público y competencia para definir la estrategia correcta.',
  },
  {
    number: '02',
    title: 'Diseño & propuesta',
    desc: 'Creamos wireframes y prototipos visuales para que apruebes antes de escribir código.',
  },
  {
    number: '03',
    title: 'Desarrollo',
    desc: 'Construimos tu sitio con las mejores tecnologías, optimizado para velocidad y SEO.',
  },
  {
    number: '04',
    title: 'Entrega & soporte',
    desc: 'Lanzamos tu sitio y te acompañamos con soporte técnico post-entrega.',
  },
]

const WHY_US = [
  {
    icon: ShieldCheck,
    title: 'Seguro & escalable',
    desc: 'Infraestructura moderna con SSL, backups automáticos y arquitectura lista para crecer contigo.',
  },
  {
    icon: Zap,
    title: 'Entrega rápida',
    desc: 'Procesos ágiles y equipo dedicado para que tu sitio esté en línea en el menor tiempo posible.',
  },
  {
    icon: Headphones,
    title: 'Soporte incluido',
    desc: 'Acompañamiento post-entrega, actualizaciones y respuesta rápida para que nunca estés solo.',
  },
]

export default function PaginasWebPage() {
  const navigate = useNavigate()

  const navLinks = [
    { label: 'Inicio',    onClick: () => navigate('/') },
    { label: 'Servicios', onClick: () => scrollTo('servicios') },
    { label: 'Proceso',   onClick: () => scrollTo('proceso') },
    { label: 'Contacto',  onClick: () => scrollTo('contacto') },
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
            Diseño &amp; Desarrollo Web Profesional
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#0B2740] dark:text-[#EAF1F8] mb-5 leading-tight tracking-tight">
            Tu presencia en internet,{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              a otro nivel
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Creamos páginas web que convierten visitantes en clientes. Desde portales
            y tiendas virtuales hasta landing pages de alto impacto, diseñadas para
            crecer con tu negocio.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('contacto')}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Solicitar proyecto
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo('servicios')}
              className="w-full sm:w-auto border border-[rgba(11,39,64,0.17)] dark:border-[rgba(234,241,248,0.18)] hover:border-primary-600 text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] hover:text-primary-600 dark:hover:text-primary-400 px-8 py-3 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5"
            >
              Ver servicios
            </button>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { value: '50+',    label: 'proyectos entregados' },
              { value: '100%',   label: 'clientes satisfechos' },
              { value: '3 años', label: 'de experiencia' },
              { value: '24/7',   label: 'soporte incluido' },
            ].map((stat) => (
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

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="py-24 px-4 bg-white dark:bg-[#0F2D45]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2740] dark:text-[#EAF1F8] mb-4">
              ¿Qué tipo de página necesitas?
            </h2>
            <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] max-w-xl mx-auto">
              Desarrollamos cualquier tipo de sitio web con tecnología de punta,
              diseño moderno y enfoque en resultados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className="group bg-[#EAF1F8] dark:bg-[#071D2E] border border-[rgba(11,39,64,0.10)] dark:border-[rgba(234,241,248,0.10)] rounded-2xl p-8 hover:border-primary-600/40 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-600/10 dark:bg-primary-600/15 flex items-center justify-center mb-6 group-hover:bg-primary-600/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0B2740] dark:text-[#EAF1F8] mb-3">{service.title}</h3>
                  <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] text-sm leading-relaxed">{service.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section id="proceso" className="py-24 px-4 bg-[#DDE5EE] dark:bg-[#0F2D45]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2740] dark:text-[#EAF1F8] mb-4">
              Cómo trabajamos
            </h2>
            <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] max-w-xl mx-auto">
              Un proceso claro y transparente para que sepas exactamente qué
              esperar en cada etapa de tu proyecto.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-600/10 dark:bg-primary-600/20 border border-primary-600/20 dark:border-primary-600/40 flex items-center justify-center mb-5 flex-shrink-0">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#0B2740] dark:text-[#EAF1F8] mb-2">{step.title}</h3>
                <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section className="py-24 px-4 bg-[#EAF1F8] dark:bg-[#071D2E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2740] dark:text-[#EAF1F8] mb-4">
              Por qué elegirnos
            </h2>
            <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)]">
              Más que desarrolladores, somos tu socio digital a largo plazo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {WHY_US.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-600/10 dark:bg-primary-600/15 flex items-center justify-center mt-0.5">
                    <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B2740] dark:text-[#EAF1F8] mb-2">{item.title}</h3>
                    <p className="text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feature checklist */}
          <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {[
              'Diseño responsive (mobile-first)',
              'Optimización SEO incluida',
              'Velocidad de carga <2s',
              'Panel de administración',
              'Integración con redes sociales',
              'Dominio y hosting asesorado',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-[rgba(11,39,64,0.66)] dark:text-[rgba(234,241,248,0.72)]">
                <Check className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL (on-dark) ── */}
      <section id="contacto" className="py-24 px-4 bg-[#0B2740] dark:bg-[#071D2E] relative overflow-hidden">
        {/* Blue glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(28,128,242,0.18), transparent)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center border border-primary-400/30 bg-primary-600/20 text-primary-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
            Empieza hoy mismo
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#EAF1F8] mb-5 leading-tight tracking-tight">
            ¿Listo para tener tu{' '}
            <span className="bg-gradient-to-r from-primary-400 to-[#BBD3E9] bg-clip-text text-transparent">
              página web
            </span>
            ?
          </h2>
          <p className="text-lg text-[rgba(234,241,248,0.72)] mb-10 max-w-xl mx-auto leading-relaxed">
            Contáctanos hoy y recibe una consulta gratuita. Te ayudamos a definir
            el proyecto ideal para tu negocio sin compromisos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-lg shadow-primary-600/40 hover:shadow-primary-600/60 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Solicitar proyecto
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto border border-[rgba(234,241,248,0.18)] hover:border-[rgba(234,241,248,0.40)] text-[rgba(234,241,248,0.72)] hover:text-[#EAF1F8] px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5"
            >
              Conoce nuestros planes
            </button>
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
            © {new Date().getFullYear()} Hub de Servicios. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
