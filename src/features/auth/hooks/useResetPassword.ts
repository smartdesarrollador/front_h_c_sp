import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { publicClient } from '@/lib/axios'

interface ResetPasswordRequest {
  token: string
  password: string
}

export function useResetPassword() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ token, password }: ResetPasswordRequest) =>
      publicClient.post('/auth/reset-password/', { token, password }),
    onSuccess: () => navigate('/login', { state: { resetSuccess: true } }),
  })
}
