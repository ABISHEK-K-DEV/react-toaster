/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-right': 'slideOutRight 0.3s cubic-bezier(0.4, 0, 1, 1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-left': 'slideOutLeft 0.3s cubic-bezier(0.4, 0, 1, 1)',
        'slide-in-top': 'slideInTop 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-top': 'slideOutTop 0.3s cubic-bezier(0.4, 0, 1, 1)',
        'slide-in-bottom': 'slideInBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-bottom': 'slideOutBottom 0.3s cubic-bezier(0.4, 0, 1, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%) scale(0.9)', opacity: 0, filter: 'blur(4px)' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: 1, filter: 'blur(0px)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateX(100%) scale(0.95)', opacity: 0 },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%) scale(0.9)', opacity: 0, filter: 'blur(4px)' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: 1, filter: 'blur(0px)' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateX(-100%) scale(0.95)', opacity: 0 },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-100%) scale(0.9)', opacity: 0, filter: 'blur(4px)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)' },
        },
        slideOutTop: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(-100%) scale(0.95)', opacity: 0 },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%) scale(0.9)', opacity: 0, filter: 'blur(4px)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)' },
        },
        slideOutBottom: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(100%) scale(0.95)', opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: 0 },
          '50%': { transform: 'scale(1.05)', opacity: 0.8 },
          '70%': { transform: 'scale(0.9)', opacity: 0.9 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
