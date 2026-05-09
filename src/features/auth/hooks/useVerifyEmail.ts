import { useMutation } from '@tanstack/react-query'
import { publicClient } from '@/lib/axios'

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) =>
      publicClient.post('/auth/verify-email', { token }).then((r) => r.data),
  })
}
