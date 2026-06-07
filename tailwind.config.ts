import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EAF1F8',
          100: '#D1E3F4',
          200: '#BBD3E9',
          300: '#8BB8E8',
          400: '#5AA6F7',
          500: '#2E8FF4',
          600: '#1C80F2',
          700: '#1568CF',
          800: '#1054A8',
          900: '#0B2740',
          950: '#071D2E',
        },
        navy: {
          800: '#0F2D45',
          900: '#0B2740',
          950: '#071D2E',
        },
        ash: {
          DEFAULT: '#DDE5EE',
          light:   '#EAF1F8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
