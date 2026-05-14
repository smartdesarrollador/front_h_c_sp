export type ReleasePlatform = 'windows' | 'macos' | 'linux'

export interface DesktopRelease {
  id: string
  version: string
  platform: ReleasePlatform
  file_url: string
  file_name: string
  file_size: number
  file_size_mb: number
  sha256: string
  release_notes: string
  is_published: boolean
  download_count: number
  created_at: string
  updated_at: string
}
