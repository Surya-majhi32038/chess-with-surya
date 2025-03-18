/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
        screens: {
            md: '900px', // Change `md` to start at 850px instead of 768px
          },
    },
  plugins: [],
}
}

