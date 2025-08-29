/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
      extend: {
        colors: { brandBg: "#171c39" },
        boxShadow: { glass: "0 8px 32px rgba(2, 8, 36, 0.45)" },
      },
    },
    plugins: [],
  };