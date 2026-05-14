import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { License } from '../types'

export function useMyLicense() {
  const { data, isLoading, error } = useQuery<License>({
    queryKey: ['desktop-license'],
    queryFn: () => apiClient.get<License>('/app/desktop-license/').then((r) => r.data),
    staleTime: 60_000,
    retry: (failureCount, err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) return false
      return failureCount < 2
    },
  })

  const notFound =
    !isLoading && (error as { response?: { status?: number } } | null)?.response?.status === 404

  return { license: data ?? null, isLoading, notFound }
}

export function useRequestLicense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiClient
        .post<{ sent_to: string; message: string }>('/app/desktop-license/request/')
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['desktop-license'] })
    },
  })
}

export function useResendLicense() {
  return useMutation({
    mutationFn: () =>
      apiClient
        .post<{ sent_to: string }>('/app/desktop-license/resend/')
        .then((r) => r.data),
  })
}
