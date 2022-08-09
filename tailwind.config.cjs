/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        ameprimary: '#F4D480',
        amesecondary: '#FDF0D4',
      },
      width: {
        128: '32rem',
      },
    },
  },
  plugins: [],
};
