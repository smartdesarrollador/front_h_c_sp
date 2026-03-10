export interface ProfileUpdateRequest {
  name: string
}

export interface PasswordChangeRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface MFASetupResponse {
  qr_uri: string
  secret: string
}
