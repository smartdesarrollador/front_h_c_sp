import { Globe } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'

function LanguageSwitcher() {
  const { language, setLanguage } = useUiStore()

  return (
    <button
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      aria-label="Toggle language"
      className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span>{language.toUpperCase()}</span>
    </button>
  )
}

export default LanguageSwitcher
