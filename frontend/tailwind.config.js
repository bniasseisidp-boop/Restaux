/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: 'rgb(var(--c-noir) / <alpha-value>)',
          900:     'rgb(var(--c-noir-900) / <alpha-value>)',
          800:     'rgb(var(--c-noir-800) / <alpha-value>)',
          700:     'rgb(var(--c-noir-700) / <alpha-value>)',
          600:     'rgb(var(--c-noir-600) / <alpha-value>)',
          500:     'rgb(var(--c-noir-500) / <alpha-value>)',
        },
        rouge: {
          DEFAULT: 'rgb(var(--c-rouge) / <alpha-value>)',
          dark:    'rgb(var(--c-rouge-dark) / <alpha-value>)',
          bright:  'rgb(var(--c-rouge-bright) / <alpha-value>)',
          900:     'rgb(var(--c-rouge-900) / <alpha-value>)',
          800:     'rgb(var(--c-rouge-800) / <alpha-value>)',
          700:     'rgb(var(--c-rouge-700) / <alpha-value>)',
          500:     'rgb(var(--c-rouge-500) / <alpha-value>)',
          300:     'rgb(var(--c-rouge-300) / <alpha-value>)',
        },
        blanc: {
          DEFAULT: 'rgb(var(--c-blanc) / <alpha-value>)',
          soft:    'rgb(var(--c-blanc-soft) / <alpha-value>)',
          muted:   'rgb(var(--c-blanc-muted) / <alpha-value>)',
        },
        or: 'rgb(var(--c-or) / <alpha-value>)',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(224, 30, 55, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(224, 30, 55, 0.9), 0 0 80px rgba(224, 30, 55, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-fire': 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(224,30,55,0.35), 0 8px 32px rgba(0,0,0,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.35), 0 4px 16px rgba(224,30,55,0.12)',
        'photo': '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
