import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0a0a0a',
          charcoal: '#161616',
          white: '#fefefe',
          gold: '#c9a24b',
          'gold-light': '#e6cd8b',
          pink: '#f2d9d9',
          'pink-deep': '#e0b8bd',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        luxe: '0 8px 40px -12px rgba(0,0,0,0.25)',
        gold: '0 0 0 1px rgba(201,162,75,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
