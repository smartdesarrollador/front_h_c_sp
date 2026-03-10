import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

const mockService = {
  id: 's1',
  name: 'Workspace',
  slug: 'workspace',
  description: 'Herramienta de productividad y gestión de proyectos',
  status: 'active',
  url: 'https://workspace.app',
  icon_url: null,
  category: 'productivity',
  is_active: true,
}

export const servicesHandlers = [
  http.get(`${API}/app/services/`, () => HttpResponse.json([mockService])),

  http.get(`${API}/app/services/active/`, () => HttpResponse.json([mockService])),
]
