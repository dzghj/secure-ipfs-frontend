/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#17b99a',
        'primary-dark': '#12926f',
        'dark-bg': '#0f2847',
        'dark-card': '#1a3f5c',
        'dark-border': '#2a5f7f',
      },
    },
  },
  plugins: [],
}
