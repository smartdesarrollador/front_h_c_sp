import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { useAuthContext } from '@/features/auth/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LINKS = [
  { to: '/dashboard', labelKey: 'navbar.dashboard' },
  { to: '/services', labelKey: 'navbar.services' },
  { to: '/subscription', labelKey: 'navbar.subscription' },
  { to: '/team', labelKey: 'navbar.team' },
  { to: '/support', labelKey: 'navbar.support' },
  { to: '/profile', labelKey: 'navbar.profile' },
]

function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthContext()
  const user = useAuthStore((s) => s.user)
  const tenant = useAuthStore((s) => s.tenant)
  const { darkMode, toggleDarkMode } = useUiStore()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    await logout()
    navigate('/login')
  }

  const initials = (user?.name ?? 'U').charAt(0).toUpperCase()
  const plan = tenant?.plan ?? 'free'

  const activeLinkClass =
    'border-b-2 border-primary-600 text-primary-700 dark:text-primary-400 pb-0.5'
  const inactiveLinkClass =
    'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 h-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo + hamburger */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={t('navbar.openMenu')}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Logo */}
          <NavLink
            to="/dashboard"
            aria-label={t('navbar.goToDashboard')}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-1"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg hidden sm:block">
              Hub
            </span>
          </NavLink>
        </div>

        {/* Center: Desktop nav links */}
        <nav aria-label="Navegacion principal" className="hidden lg:flex items-center gap-1 h-full">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium flex items-center h-full ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {/* Plan badge */}
          <span className="hidden sm:flex items-center bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full px-2.5 py-1 text-xs font-medium">
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </span>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Bell icon — navigates to /notifications (PASO 11 will connect unread count) */}
          <button
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label={t('navbar.userMenu')}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {userMenuOpen && (
              <>
                {/* Click-outside overlay */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20"
                  role="menu"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <NavLink
                    role="menuitem"
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {t('navbar.viewProfile')}
                  </NavLink>

                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('navbar.logout')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md">
          <nav className="px-4 py-3 space-y-1" aria-label="Navegacion movil">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {t(link.labelKey)}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
              {/* Theme + language row */}
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark mode"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  {darkMode ? t('common.lightMode') : t('common.darkMode')}
                </button>
              </div>

              {/* User info */}
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('navbar.logout')}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
