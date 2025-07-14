/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sohne: ['Soehne', 'sans-serif'],
      },
      fontWeight: {
        light: '300', // Leicht
        normal: '400', // Buch
        bold: '700', // Kräftig
      },
      backgroundColor: {
        'nextra-bg': 'var(--x-color-nextra-bg)',
      },
      screens: {
        '3xl': '1600px',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-bullets': 'var(--tw-prose-body)',
          },
        },
      },
    },
  },
};
