/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A2E",
        canvas: "#FAFAF7",
        accent: "#B45309",
        accentSoft: "#FEF3E2",
      },
    },
  },
  plugins: [],
};
