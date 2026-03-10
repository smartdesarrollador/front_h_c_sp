import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { PasswordChangeRequest } from '../types'

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) =>
      apiClient.post('/auth/change-password/', data),
  })
}
