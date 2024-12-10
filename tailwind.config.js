/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './app/**/*.{js,ts,jsx,tsx}', // Include files in the `app` directory
    './pages/**/*.{js,ts,jsx,tsx}', // Include files in the `pages` directory
    './components/**/*.{js,ts,jsx,tsx}', // Include files in the `components` directory
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo Black', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
      colors: {
        'navy': '#002379',
        'navy-light': '#002b99',
        'purple': '#4F1787',
        'orange-dark': '#e65400',
        'orange-light': '#ff5f00',
        'beige': '#FFFAE6'
      },
    },
  },
  plugins: [],
}