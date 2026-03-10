import '@testing-library/jest-dom'
import axios from 'axios'
import { server } from './server'
import { toHaveNoViolations } from 'jest-axe'
import type { RunOptions } from 'axe-core'

// CRÍTICO: fuerza Axios a usar http de Node.js para que MSW pueda interceptar
axios.defaults.adapter = 'http'

// ResizeObserver mock (jsdom no lo implementa)
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jest-axe matcher
expect.extend(toHaveNoViolations)

// Axe config: deshabilitar color-contrast (CSS no disponible en jsdom)
export const axeConfig: RunOptions = {
  rules: { 'color-contrast': { enabled: false } },
}

// MSW lifecycle — bypass unhandled → no rompe tests con vi.mock
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
