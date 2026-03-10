import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, UserPlus, Loader2 } from 'lucide-react'
import { useInviteTeamMember } from '../hooks/useInviteTeamMember'

const inviteSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  role: z.enum(['admin', 'member']),
})

type InviteFormData = z.infer<typeof inviteSchema>

interface InviteTeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InviteTeamMemberModal({ isOpen, onClose }: InviteTeamMemberModalProps) {
  const invite = useInviteTeamMember()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'member' },
  })

  const onSubmit = (data: InviteFormData) => {
    invite.mutate(data, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2
            id="invite-modal-title"
            className="text-base font-semibold text-gray-900"
          >
            Invitar miembro
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="invite-email"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Email del nuevo miembro
            </label>
            <input
              id="invite-email"
              type="email"
              placeholder="nuevo@empresa.com"
              {...register('email')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="invite-role"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Rol
            </label>
            <select
              id="invite-role"
              {...register('role')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="admin">Administrador</option>
              <option value="member">Miembro</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={invite.isPending}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={invite.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {invite.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus size={16} />
              )}
              Invitar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
