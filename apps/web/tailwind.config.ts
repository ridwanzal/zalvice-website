import type { Config } from 'tailwindcss';
import preset from '@zalvice/config/tailwind.preset.cjs';

export default {
  presets: [preset],
  content: ['./src/**/*.{astro,ts,tsx,md,mdx}'],
} satisfies Config;
