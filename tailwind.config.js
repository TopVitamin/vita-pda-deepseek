/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1e5fb4', dark: '#164a8f', light: '#3b7dd8' },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        pending: '#9ca3af',
      },
      fontSize: {
        'pda-sm': '14px',
        'pda-base': '16px',
        'pda-lg': '18px',
        'pda-xl': '20px',
        'pda-2xl': '24px',
      },
      minHeight: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};
