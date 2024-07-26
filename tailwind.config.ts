// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Adjust the path to match your project structure
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00AE98",
          light: "#33BFAE",
          dark: "#008F7A",
        },
        secondary: {
          DEFAULT: "#707070",
          light: "#8E8E8E",
          dark: "#5A5A5A",
        },
        background: {
          DEFAULT: "#1a1a1a", // Dark mode background color
          light: "#f8f9fa", // Light mode background color
        },
        foreground: {
          DEFAULT: "#ffffff", // Dark mode text color
          light: "#212529", // Light mode text color
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Custom font family
      },
      gradientColorStops: {
        primary: "#00AE98",
        secondary: "#707070",
      },
      keyframes: {
        "3d-rotate": {
          "0%, 100%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(180deg)" },
        },
        "3d-bounce": {
          "0%, 100%": { transform: "translateZ(0)" },
          "50%": { transform: "translateZ(50px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        parallax: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-30px)" },
        },
        "rotate-in": {
          "0%": { transform: "rotate(-360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.5)" },
          "100%": { transform: "scale(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "3d-rotate": "3d-rotate 5s infinite",
        "3d-bounce": "3d-bounce 3s infinite",
        "fade-in": "fade-in 2s ease-in-out",
        "slide-in": "slide-in 1s ease-out",
        parallax: "parallax 10s infinite alternate",
        "rotate-in": "rotate-in 1s ease-in-out",
        "zoom-in": "zoom-in 0.5s ease-in-out",
        pulse: "pulse 2s infinite",
        "bounce-in": "bounce-in 1s ease-in-out",
      },
      boxShadow: {
        "custom-light": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "custom-dark": "0 4px 6px rgba(0, 0, 0, 0.4)",
        "3d-light": "10px 10px 30px rgba(0, 0, 0, 0.1)",
        "3d-dark": "10px 10px 30px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(0, 174, 152, 0.5)",
        neon: "0 0 10px rgba(0, 174, 152, 0.5), 0 0 20px rgba(0, 174, 152, 0.3), 0 0 30px rgba(0, 174, 152, 0.2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "gradient-multi":
          "linear-gradient(135deg, #00AE98, #33BFAE, #8E8E8E, #707070)",
        "gradient-border":
          "linear-gradient(135deg, #00AE98, #33BFAE, #8E8E8E, #707070)",
        "gradient-diagonal":
          "linear-gradient(45deg, #00AE98, #33BFAE, #8E8E8E, #707070)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  // other configuration options
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animated"), // Add tailwindcss-animated plugin here
  ],
};

export default config;
