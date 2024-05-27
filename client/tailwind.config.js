/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'lime-600': '#65a30d', // The HEX value for lime-600
        'lime-700': '#15803d'  // The HEX value for lime-700
      },
    },
  },
  plugins: [],
}

