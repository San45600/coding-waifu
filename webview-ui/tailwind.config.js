/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scale: {
        160: "1.6",
        '10x': "10",
      },
      fontFamily: {
        'lato': ['Lato', 'sans-serif']
      },
    },
  },
  plugins: [],
};
