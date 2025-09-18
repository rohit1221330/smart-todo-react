/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Add daisyUI plugin
  plugins: [require("daisyui")],
  // daisyUI config
  daisyui: {
    themes: ["light", "dark"], // Add light and dark themes
  },
}