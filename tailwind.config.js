/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,css}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef7f6',
          100: '#d6edeb',
          200: '#b2ddd9',
          300: '#7fc4be',
          400: '#4da39c',
          500: '#338882',
          600: '#2a6f6a',
          700: '#265a57',
          800: '#234a48',
          900: '#213e3d',
          950: '#0f2625',
        },
        surface: {
          warm: '#faf9f7',
          card: '#ffffff',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 38, 37, 0.06), 0 1px 2px rgba(15, 38, 37, 0.04)',
        cardHover: '0 8px 24px rgba(15, 38, 37, 0.08), 0 2px 6px rgba(15, 38, 37, 0.04)',
      },
    },
  },
  plugins: [],
};
