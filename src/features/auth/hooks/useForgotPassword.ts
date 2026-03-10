import { useMutation } from '@tanstack/react-query'
import { publicClient } from '@/lib/axios'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      publicClient.post('/auth/forgot-password', { email }),
  })
}
