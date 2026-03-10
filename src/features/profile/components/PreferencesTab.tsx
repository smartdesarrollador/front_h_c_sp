import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/store/uiStore'

const TIMEZONES = [
  { value: 'America/Mexico_City', label: 'tz1' },
  { value: 'America/Bogota', label: 'tz2' },
  { value: 'America/Argentina/Buenos_Aires', label: 'tz3' },
  { value: 'America/New_York', label: 'tz4' },
  { value: 'Europe/Madrid', label: 'tz5' },
]

function PreferencesTab() {
  const { t } = useTranslation('profile')
  const language = useUiStore((s) => s.language)
  const setLanguage = useUiStore((s) => s.setLanguage)
  const darkMode = useUiStore((s) => s.darkMode)
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode)
  const [timezone, setTimezone] = useState('America/Mexico_City')

  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-base font-medium text-gray-900">{t('langSection')}</h3>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            {t('langField')}
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="es">{t('langEs')}</option>
            <option value="en">{t('langEn')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            {t('timezoneField')}
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {t(tz.label)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Modo oscuro</p>
            <p className="text-xs text-gray-500">
              {darkMode ? t('on') : t('off')}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={darkMode}
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreferencesTab
