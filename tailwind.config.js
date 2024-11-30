/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#1f2937',
            h1: {
              color: '#1f2937',
            },
            h2: {
              color: '#1f2937',
            },
            h3: {
              color: '#1f2937',
            },
            'code': {
              color: '#1f2937',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.25rem',
              padding: '0.2em 0.4em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

