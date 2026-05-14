import { useQuery } from '@tanstack/react-query'
import { publicClient } from '@/lib/axios'
import type { DesktopRelease } from '../types'

interface LatestReleasesResponse {
  releases: DesktopRelease[]
}

export function useLatestReleases() {
  const { data, isLoading } = useQuery({
    queryKey: ['hub-desktop-releases'],
    queryFn: () =>
      publicClient
        .get<LatestReleasesResponse>('/public/desktop/latest/')
        .then((r) => r.data.releases),
    staleTime: 5 * 60_000,
  })

  return { releases: data ?? [], isLoading }
}
