import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

export const ssoHandlers = [
  http.post(`${API}/auth/sso/token/`, () =>
    HttpResponse.json({
      sso_token: 'mock-sso-token',
      expires_in: 60,
      redirect_url: 'https://workspace.app/?sso_token=mock-sso-token',
    }),
  ),
]
