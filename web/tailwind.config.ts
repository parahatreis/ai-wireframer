import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: '#f3f7f6',
        secondaryBackground: '#FFFFFF',
        foreground: '#0F2E28',
        content: '#1B4038',
        primary: {
          100: '#E9FFC9',
          500: '#CDFA8A',
          foreground: '#0F2E28',
          DEFAULT: '#CDFA8A',
        },
      }
    },
  },
  plugins: [],
}

export default config

