/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 14px 45px rgba(79, 70, 229, 0.10)',
        glow: '0 18px 60px rgba(124, 58, 237, 0.18)',
      },
    },
  },
  plugins: [],
}
