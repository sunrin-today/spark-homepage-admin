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
      white: "#F9F9F9",
      black: "#1B1B1B",
      council: "#6CA9FF",
      software: "#F79447",
      computersecurity: "#6CA9FF",
      itmanagement: "#85C879",
      contentsdesign: "#6CA9FF",
      gray: "#767676",
      sunday: '#FA5353',
      saturday: '#4D71FF',
      
    }
  },
  plugins: [],
}