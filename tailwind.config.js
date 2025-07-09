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
        "foreground": "var(--foreground)",
        "foreground2": "var(--foreground2)",
        "border": "var(--border)",
        "secondary": "var(--secondary)",
        "accent": "var(--accent)",
        "background2": "var(--background2)"
      },
    },
  },
  plugins: [],
}

