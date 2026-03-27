import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        luxury: {
          50: '#fbfaf8',
          100: '#f6f3ee',
          200: '#ece5d9',
          300: '#ded2bc',
          400: '#cdba99',
          500: '#c0a57e',
          600: '#b49268',
          700: '#977755',
          800: '#7e634a',
          900: '#66513d',
          950: '#382a1f',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
