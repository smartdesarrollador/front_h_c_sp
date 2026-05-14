export type ReleasePlatform = 'windows' | 'macos' | 'linux'

export type LicenseStatus = 'active' | 'pending' | 'revoked'

export interface License {
  id: string
  license_key: string
  status: LicenseStatus
  hardware_id: string | null
  activated_at: string | null
  expires_at: string | null
  is_active: boolean
  sent_at: string | null
}

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
