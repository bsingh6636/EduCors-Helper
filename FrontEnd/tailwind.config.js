/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark': '#151515'
      },
      scale: {
        'defined': '1.009',
      },
      fontFamily: {
        'send-flowers': ['Send Flowers', 'system-ui'],
      },
    },
  },
  plugins: [],
}


