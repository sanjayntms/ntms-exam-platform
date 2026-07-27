/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ntms: {
          navy: '#002B49',
          darkNavy: '#001E33',
          blue: '#005B94',
          hoverBlue: '#004673',
          lightBlue: '#E6F2F8',
          gold: '#D97706',
          grayBg: '#F8FAFC',
          panelBg: '#FFFFFF',
          border: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
