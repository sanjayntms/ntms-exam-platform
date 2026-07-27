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
        fluent: {
          blue: '#0078D4',
          blueDark: '#005A9E',
          blueLight: '#2B88D8',
          bgDark: '#111827',
          cardDark: '#1F2937',
          borderDark: '#374151',
          azureHeader: '#002050',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
