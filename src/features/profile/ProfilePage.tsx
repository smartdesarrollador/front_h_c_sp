import { useState } from 'react'
import { User, Shield, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import PersonalInfoTab from './components/PersonalInfoTab'
import SecurityTab from './components/SecurityTab'
import PreferencesTab from './components/PreferencesTab'

type TabId = 'account' | 'security' | 'preferences'

interface TabItem {
  id: TabId
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
}

const TABS: TabItem[] = [
  { id: 'account', labelKey: 'tabAccount', icon: User },
  { id: 'security', labelKey: 'tabSecurity', icon: Shield },
  { id: 'preferences', labelKey: 'tabPreferences', icon: Settings },
]

function ProfilePage() {
  const { t } = useTranslation('profile')
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState<TabId>('account')

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      {/* User summary */}
      <div className="mb-6 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Vertical tab nav */}
        <nav className="min-w-[180px] space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-l-2 border-primary-600 bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {t(tab.labelKey)}
              </button>
            )
          })}
        </nav>

        {/* Content area */}
        <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-6">
          {activeTab === 'account' && <PersonalInfoTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'preferences' && <PreferencesTab />}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
