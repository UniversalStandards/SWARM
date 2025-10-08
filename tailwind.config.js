// Tailwind CSS configuration for AI Agent Swarm Orchestrator project
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6D28D9',
          DEFAULT: '#5B21B6',
          dark: '#4C1D95',
        },
        secondary: {
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        neutral: {
          light: '#F3F4F6',
          DEFAULT: '#9CA3AF',
          dark: '#374151',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in forwards',
        slideIn: 'slideIn 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.dark'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.light'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
