/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sportsBlue: '#0f3d68',
        sportsTan: '#f6f3ea',
        sportsGray: '#d5d5d5',
      }
    },
  },
  
  plugins: [],
}