import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { Invoice } from '../types'

export function useInvoices() {
  const { data, isLoading } = useQuery({
    queryKey: ['hub-invoices'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/billing/invoices/')
      return res.data.invoices as Invoice[]
    },
    staleTime: 300_000,
  })
  return { invoices: data ?? [], isLoading }
}
