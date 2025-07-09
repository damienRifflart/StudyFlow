/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "var(--background)",
        "backgroundNav": "var(--backgroundNav)",
        "foreground": "var(--foreground)",
        "foregroundNav": "var(--foregroundNav)",
        "border": "var(--border)",
      },
    },
  },
  plugins: [],
}

