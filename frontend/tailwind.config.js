/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "350px",
      // => @media (min-width: 350px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1500px",
      // => @media (min-width: 1500px) { ... }

      "3xl": "1800px",
      // => @media (min-width: 1800px) { ... }
    },
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans"],
      },
    },
  },
  plugins: [],
};
