/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgDark: "#0b0014",
        bgCard: "#130029",
        textPrimary: "#f8f7ff",
        textMuted: "#a78bfa",
        primary: "#7c3aed",
        accent: "#c084fc",
      },
      boxShadow: {
        glow: "0 0 12px rgba(124,58,237,0.5)",
      },
    },
  },
  plugins: [],
};
