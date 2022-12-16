/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "card-draw": {
          "0%": { transform: "rotate(12deg) translateX(.25rem)", opacity: 1 },
          "100%": { transform: "rotate(90deg) translateX(4rem)", opacity: 0 },
        }
      },
      animation: {
        "draw-card": "card-draw 1s ease-in-out",
      }
    },
  },
  plugins: [],
};
