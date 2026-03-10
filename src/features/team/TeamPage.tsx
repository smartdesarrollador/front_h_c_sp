import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserPlus } from 'lucide-react'
import { usePermissions } from '@/hooks/usePermissions'
import { useCurrentSubscription } from '@/features/subscription/hooks/useCurrentSubscription'
import { useTeamMembers } from './hooks/useTeamMembers'
import { TeamUsageBar } from './components/TeamUsageBar'
import { TeamTable } from './components/TeamTable'
import { PendingInvitations } from './components/PendingInvitations'
import { InviteTeamMemberModal } from './components/InviteTeamMemberModal'

export default function TeamPage() {
  const { t } = useTranslation('hub')
  const { isOwner, isAdmin, hasPermission } = usePermissions()
  const { activeMembers, pendingMembers, isLoading } = useTeamMembers()
  const { subscription } = useCurrentSubscription()
  const [showInviteModal, setShowInviteModal] = useState(false)

  const canInvite = hasPermission('users.invite') || isOwner || isAdmin
  const canSuspend = hasPermission('users.update') || isOwner || isAdmin
  const canDelete = hasPermission('users.delete') || isOwner

  const usersUsage = subscription?.usage?.users
  const limitReached = usersUsage?.limit != null && usersUsage.current >= usersUsage.limit

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('team.title')}</h1>
          <p className="text-gray-500 mt-1">{t('team.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          disabled={!canInvite || limitReached}
          title={limitReached ? t('team.limitReached') : undefined}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <UserPlus size={16} />
          {t('team.invite')}
        </button>
      </div>

      {/* Usage bar */}
      <TeamUsageBar />

      {/* Members table */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('team.members')}</h2>
        <TeamTable
          members={activeMembers}
          isLoading={isLoading}
          canSuspend={canSuspend}
          canDelete={canDelete}
        />
      </section>

      {/* Pending invitations */}
      <PendingInvitations members={pendingMembers} />

      <InviteTeamMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  )
}
