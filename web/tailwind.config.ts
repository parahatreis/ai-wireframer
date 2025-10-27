import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0B1E1B',
        foreground: '#F8FAFC',
        card: 'rgba(255, 255, 255, 0.05)',
        'card-border': 'rgba(255, 255, 255, 0.1)',
        primary: {
          DEFAULT: '#57B50D',
          foreground: '#0B1E1B',
          hover: '#81C747',
        },
        primaryLight: '#81C747',
        secondary: {
          DEFAULT: '#60A5FA',
          foreground: '#0B1E1B',
        },
        accent: {
          DEFAULT: '#2DD4BF',
          foreground: '#0B1E1B',
        },
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          foreground: '#CBD5E1',
        },
        destructive: {
          DEFAULT: '#F87171',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#FBBF24',
          foreground: '#0B1E1B',
        },
        success: {
          DEFAULT: '#34D399',
          foreground: '#0B1E1B',
        },
        border: 'rgba(255, 255, 255, 0.1)',
        input: 'rgba(255, 255, 255, 0.12)',
        ring: '#5EEAD4',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0B1E1B 0%, #001F2F 100%)',
        'gradient-canvas': 'linear-gradient(135deg, #0F2420 0%, #002838 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(94, 234, 212, 0.3)',
        'glow': '0 0 30px rgba(94, 234, 212, 0.5)',
        'glow-lg': '0 0 40px rgba(94, 234, 212, 0.6)',
        'glow-cyan': '0 0 25px rgba(45, 212, 191, 0.4)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

