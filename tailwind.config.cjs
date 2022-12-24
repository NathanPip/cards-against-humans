/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("tailwindcss-animated"), require("tailwindcss-textshadow")],
  theme: {
    extend: {
      keyframes: {
        "card-draw": {
          "0%": { transform: "rotate(12deg) translateX(.25rem)", opacity: 1 },
          "100%": { transform: "rotate(90deg) translateX(4rem)", opacity: 0 },
        },
        "card-wiggle": {
          "0%": { rotate: "0deg" },
          "50%": { rotate: "3deg", translate: ".25rem 0" },
          "100%": { rotate: "0deg" },
        },
      },
      animation: {
        "draw-card": "card-draw 1s ease-in-out",
        "wiggle-card": "card-wiggle 1s ease-in-out .5s infinite",
      },
      animationDelay: {
        3000: "3000ms",
        5000: "5000ms",
      },

      boxShadow: {
        inset: "inset 0 0 4px 2px rgba(0,0,0,0.2)",
      },
    },
  },
};
