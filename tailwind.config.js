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
          DEFAULT: '#9D1942',
          dark: '#7A1333',
          light: '#B81E4F',
        },
        secondary: {
          DEFAULT: '#F2B704',
          dark: '#D4A103',
          light: '#FFC107',
        },
        dark: '#2B2422',
        gray: {
          custom: '#979493',
        },
      },
      fontFamily: {
        galvji: ['Galvji', 'sans-serif'],
        neo: ['Neo Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
      })
    }
  ],
}
