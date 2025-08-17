/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'shelf': 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -10px 20px rgba(0,0,0,0.08), 0 12px 18px rgba(0,0,0,0.10)'
      }
    },
  },
  plugins: [],
}
