/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      gray : "#C0C0C0",
      main : "#FF805C",
      white : "#F9F9F9",
      lightgray : "#EEEEEE",
      black : "#0D0D0D",
      
    }
  },
  plugins: [],
}