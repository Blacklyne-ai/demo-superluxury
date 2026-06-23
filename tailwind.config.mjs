/** @type {import('tailwindcss').Config} */
// Super Luxury Car Rental — cinematic dark-luxury CI.
//   Palette is pixel-derived from the logo: white wordmark + muted champagne-gold
//   emblem (#998855 core, saturated cluster #8B804A). System = deep cinematic black
//   + warm ivory text + a single restrained champagne-gold accent (used sparingly:
//   prices, CTAs, hairline highlights). Single source of truth for values:
//   src/styles/global.css :root (RGB triplets, for Tailwind alpha support).
//   Fonts: Sora (display, architectural) + Inter (UI / specs / prices).
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--rgb-ink) / <alpha-value>)',          // #0A0A0B deepest cinematic ground
        coal: 'rgb(var(--rgb-coal) / <alpha-value>)',        // #121214 section
        graphite: 'rgb(var(--rgb-graphite) / <alpha-value>)',// #18181B card surface
        steel: 'rgb(var(--rgb-steel) / <alpha-value>)',      // #232327 raised / border
        ivory: 'rgb(var(--rgb-ivory) / <alpha-value>)',      // #F4F2EC primary text on dark
        mist: 'rgb(var(--rgb-mist) / <alpha-value>)',        // #B4AFA4 secondary text
        faint: 'rgb(var(--rgb-faint) / <alpha-value>)',      // #7C786F tertiary
        line: 'rgb(var(--rgb-line) / <alpha-value>)',        // hairline base
        gold: {
          DEFAULT: 'rgb(var(--rgb-gold) / <alpha-value>)',   // #C6A45C champagne accent
          lite: 'rgb(var(--rgb-gold-lite) / <alpha-value>)', // #E4CE97 highlight / shimmer
          deep: 'rgb(var(--rgb-gold-deep) / <alpha-value>)', // #93824B logo-true, borders/hover
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
      },
      letterSpacing: {
        tightish: '-0.015em',
        tight2: '-0.03em',
        luxe: '0.34em',
        wide2: '0.22em',
        wide3: '0.12em',
      },
      opacity: { 8: '0.08', 12: '0.12', 15: '0.15', 35: '0.35', 45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85' },
      borderRadius: { pill: '999px', xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem' },
      maxWidth: { '7xl': '80rem', '8xl': '90rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.4), 0 18px 50px -28px rgb(0 0 0 / 0.8)',
        lift: '0 2px 8px rgb(0 0 0 / 0.5), 0 50px 110px -50px rgb(0 0 0 / 0.95)',
        'glow-gold': '0 0 0 1px rgb(var(--rgb-gold) / 0.45), 0 20px 60px -20px rgb(var(--rgb-gold) / 0.28)',
      },
      transitionTimingFunction: { luxe: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(22px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.4', transform: 'scale(0.78)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        scrollcue: { '0%': { transform: 'translateY(0)', opacity: '0' }, '40%': { opacity: '1' }, '100%': { transform: 'translateY(12px)', opacity: '0' } },
        kenburns: { '0%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1.16)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fadeIn 1.1s ease both',
        'pulse-dot': 'pulseDot 2.4s ease-in-out infinite',
        shimmer: 'shimmer 9s linear infinite',
        scrollcue: 'scrollcue 1.9s ease-in-out infinite',
        kenburns: 'kenburns 18s ease-out both',
        marquee: 'marquee 42s linear infinite',
      },
    },
  },
  plugins: [],
};
