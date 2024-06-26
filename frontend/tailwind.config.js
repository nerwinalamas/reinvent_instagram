/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"]
      },
      colors: {
        customBlack: "#0E0E0E",
        customWhite: "#fffffe",
        customGray: "#1E1E1E"
      }
    },
 
  },
  plugins: [require("daisyui")],
  darkMode: "class"
}

