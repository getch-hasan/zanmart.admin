/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    container: {
      center: true,
      padding: "1rem"
    },
    extend: {
      animation: {
        wave: 'wave 2s ease-out infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'scale(0.5)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
      fontFamily: {
        heading: "'Russo One', sans-serif",
        content: "'Rajdhani', sans-serif"
      },
      colors: {
        'primary': "#3B82F6",
      }
    },
  },
  plugins: [require("daisyui")],
}