import { create } from 'zustand'
import i18n from '@/i18n/config'

type Language = 'es' | 'en'

interface UiState {
  darkMode: boolean
  language: Language
  toggleDarkMode: () => void
  setLanguage: (lang: Language) => void
}

const getInitialDarkMode = (): boolean => {
  try { return localStorage.getItem('hub-theme') === 'dark' } catch { return false }
}

const getInitialLanguage = (): Language => {
  try {
    const lang = localStorage.getItem('hub-lang')
    return lang === 'en' ? 'en' : 'es'
  } catch { return 'es' }
}

const syncDarkMode = (enabled: boolean) => {
  document.documentElement.classList.toggle('dark', enabled)
  try { localStorage.setItem('hub-theme', enabled ? 'dark' : 'light') } catch { /* ignore */ }
}

// Apply initial dark mode class before first render
;(syncDarkMode)(getInitialDarkMode())

export const useUiStore = create<UiState>((set) => ({
  darkMode: getInitialDarkMode(),
  language: getInitialLanguage(),
  toggleDarkMode: () =>
    set((s) => { const next = !s.darkMode; syncDarkMode(next); return { darkMode: next } }),
  setLanguage: (lang) => {
    i18n.changeLanguage(lang)
    try { localStorage.setItem('hub-lang', lang) } catch { /* ignore */ }
    set({ language: lang })
  },
}))
