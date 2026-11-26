/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        avis: { DEFAULT: '#E31E24', dark: '#B9151A' },
        navy: { DEFAULT: '#174A8B', dark: '#0F3563' },
        mist: '#EEF5FC',
        blush: '#FFF0F0',
        ink: '#1B2433',
      },
      fontFamily: {
        display: ['Poppins', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.75rem' },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(23,74,139,0.25)',
        lift: '0 18px 40px -14px rgba(227,30,36,0.35)',
      },
    },
  },
  plugins: [],
}
