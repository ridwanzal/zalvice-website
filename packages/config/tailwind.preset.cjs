/**
 * Shared Tailwind preset — design tokens defined here, consumed by every
 * surface (web, future packages). Tokens match PRD.md §7 "Design System".
 *
 * Hard rule from CLAUDE.md: never use inline hex values; reference these
 * tokens (text-brand, bg-mist, border-line, etc.).
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#1E5FFF',
        navy: '#0A2540',
        ink: '#0A0A0A',
        paper: '#FFFFFF',
        mist: '#F5F7FB',
        line: '#E1E6EF',
        muted: '#6B7280',
        danger: '#DC2626',
        success: '#059669',
      },
      fontFamily: {
        // Body text — Inter (variable, self-hosted via @fontsource).
        sans: ['"Inter Variable"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
        // Headings — Plus Jakarta Sans (variable, self-hosted).
        display: [
          '"Plus Jakarta Sans Variable"',
          '"Plus Jakarta Sans"',
          '"Inter Variable"',
          'Inter',
          'Helvetica',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid display sizes. clamp(min, preferred, max).
        'display': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.75rem, 4vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'h3': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.25' }],
        'h4': ['clamp(1.125rem, 2vw, 1.375rem)', { lineHeight: '1.3' }],
      },
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        // PRD §7: 8px cards, 12px large surfaces, 999px pills.
        // Tailwind defaults give lg=8px, xl=12px, full=9999px — no override needed.
      },
    },
  },
  plugins: [],
};
