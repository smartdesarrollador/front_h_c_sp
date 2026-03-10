import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

export function useMFADisable() {
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: () => apiClient.post('/auth/mfa/disable/'),
    onSuccess: () => {
      if (user) setUser({ ...user, mfaEnabled: false })
    },
  })
}
