import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { MFASetupResponse } from '../types'

export function useMFASetup() {
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  return useMutation<MFASetupResponse>({
    mutationFn: async () => {
      const res = await apiClient.post('/auth/mfa/enable/')
      return res.data
    },
    onSuccess: () => {
      if (user) setUser({ ...user, mfaEnabled: true })
    },
  })
}
