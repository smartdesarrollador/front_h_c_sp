export interface SSOTokenResponse {
  sso_token: string
  redirect_url: string
  expires_in: number
}

export interface SSOPayload {
  service: string
}
