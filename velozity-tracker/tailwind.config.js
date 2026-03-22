/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          1: '#0f1117',
          2: '#161b27',
          3: '#1e2535',
          4: '#252d3d',
        },
        border: {
          1: '#2e3a52',
          2: '#3d4f6e',
        },
        accent: '#4f8ef7',
        'accent-2': '#6fa3ff',
        priority: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#22c55e',
        },
        status: {
          todo: '#6366f1',
          inprogress: '#3b82f6',
          inreview: '#a855f7',
          done: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
