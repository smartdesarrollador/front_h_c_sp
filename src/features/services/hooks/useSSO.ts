import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { SSOTokenResponse, SSOPayload } from '../types'

export function useSSO() {
  return useMutation<SSOTokenResponse, Error, SSOPayload>({
    mutationFn: (payload) =>
      apiClient.post<SSOTokenResponse>('/auth/sso/token/', payload).then((r) => r.data),
    onSuccess: (data) => {
      window.location.href = data.redirect_url
    },
  })
}
