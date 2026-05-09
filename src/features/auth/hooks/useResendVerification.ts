import { useMutation } from '@tanstack/react-query'
import { publicClient } from '@/lib/axios'

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) =>
      publicClient.post('/auth/resend-verification', { email }).then((r) => r.data),
  })
}
