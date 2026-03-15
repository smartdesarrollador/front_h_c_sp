import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/features/auth/AuthContext'

export function useLogin(options?: { skipNavigate?: boolean }) {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (result) => {
      if ('ok' in result && !options?.skipNavigate) navigate('/dashboard')
    },
  })
}
