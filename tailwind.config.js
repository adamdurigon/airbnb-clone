/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        80: '0.8',
        85: '0.85'
      }
    },
  },
  variants: {
    extend: {
      scale: ['responsive'] 
    }
  },
  plugins: [],
}

