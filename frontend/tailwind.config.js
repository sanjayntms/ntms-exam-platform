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
        pearson: {
          navy: '#002B49',
          darkNavy: '#001A2E',
          blue: '#005B94',
          hoverBlue: '#00436E',
          lightBlue: '#E6F2F8',
          gold: '#D97706',
          goldLight: '#FEF3C7',
          grayBg: '#F3F4F6',
          panelBg: '#FFFFFF',
          border: '#CBD5E1',
          textDark: '#1E293B',
          textMuted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
