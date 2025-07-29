module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        canvaPop: {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out',
        'fade-up-slow': 'fadeUp 1s ease-out',
        'canva-pop': 'canvaPop 0.8s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
