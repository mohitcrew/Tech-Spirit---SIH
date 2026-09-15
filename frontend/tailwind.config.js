/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#2563EB',
          navy: '#0F172A',
          green: '#10B981',
          purple: '#8B5CF6',
          amber: '#F59E0B',
          sky: '#38BDF8',
          cyan: '#06B6D4',
        },
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
      },
      boxShadow: {
        'card': '0 4px 14px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(15, 23, 42, 0.09), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
