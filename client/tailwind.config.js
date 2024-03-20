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
          DEFAULT: '#2e318e',
          light: '#4548a1',
          dark: '#1d2060', 
        },
        secondary: {
          DEFAULT: '#39771f',
          light: '#4c8c2a',
          dark: '#295414', 
        },
        tertiary: {
          DEFAULT: '#7d5ba6',
          light: '#9672c4', 
          dark: '#634279', 
        },
        fourth: {
          DEFAULT: '#6aa84f',
          light: '#82c467', 
          dark: '#528237', 
        },
        white: {
          DEFAULT: '#ffffff',
          light: '#ffffff',
          dark: '#f0f0f0', 
        },
      },
      height: {
        '128': '32rem',
      },
      spacing: {
        '1/10': '10%',
        'middle-process': '47%',
      },
    },
  },
  plugins: [],
}