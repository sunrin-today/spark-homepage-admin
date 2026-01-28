/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    keyframes: {
        slideUpFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        slideUpFadeIn: 'slideUpFadeIn 0.3s ease-out forwards',
    },
    colors: {
      white: "#F9F9F9",
      black: "#010101",
      council: "#6CA9FF",
      infosec: "#F79447",
      software: "#ECB220",
      itmanagement: "#85C879",
      contentsdesign: "#089ED5",
      gray: "#767676",
      "toggle-checked": "#6BDA72",
      darkgray: "#777777",
      inputborder: "#D5D5D5",
      sunday: '#FA5353',
      saturday: '#4D71FF',
      lightgray: '#EEEEEE',
      error: "#FA5353"
    }
  },
  plugins: [],
}