/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f2145',
          700: '#142d5e',
        },
        gov: {
          navy: '#112e51',
          'navy-dark': '#0a1c33',
          'navy-light': '#1b3f73',
          saffron: '#FF9933',
          'saffron-dark': '#d97706',
          green: '#138808',
          'green-dark': '#15803d',
          ashoka: '#000080',
          paper: '#f8f9fa',
          border: '#cbd5e1',
        },
        accent: {
          teal: '#0d9488',
        }
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
