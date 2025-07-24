/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
        },
        'sidebar-primary': {
          DEFAULT: 'var(--sidebar-primary)',
          foreground: 'var(--sidebar-primary-foreground)',
        },
        'sidebar-accent': {
          DEFAULT: 'var(--sidebar-accent)',
          foreground: 'var(--sidebar-accent-foreground)',
        },
        'sidebar-border': 'var(--sidebar-border)',
        'sidebar-ring': 'var(--sidebar-ring)',
      },
      fontFamily: {
        soehne: ['Soehne', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
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
