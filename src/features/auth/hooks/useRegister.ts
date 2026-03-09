import { useMutation } from '@tanstack/react-query'
import { useAuthContext } from '@/features/auth/AuthContext'
import type { RegisterRequest } from '@/features/auth/AuthContext'

export function useRegister() {
  const { register } = useAuthContext()
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  })
}
