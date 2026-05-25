/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#e1e8f0',
          200: '#c3d1e1',
          300: '#a5bad2',
          400: '#7a94b8',
          500: '#4f6e9e',
          600: '#1e3a5f',
          700: '#1a2e4d',
          800: '#16243b',
          900: '#0f1929',
          950: '#0a0f17',
        },
      },
    },
  },
  plugins: [],
}
