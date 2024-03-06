/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      primary: '#2e318e',
        primaryDark: '#1d2060',
        secondary: '#39771f',
        secondaryDark: '#295414',
      tertiary: '#2e318e',
      fourth: '#6aa84f',
      white: '#f0f0f0',
    },
    spacing: {
      '1/10': '10%',
    },},
  },
  plugins: [],
}

