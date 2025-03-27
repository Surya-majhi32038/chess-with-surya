/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
        screens: {
            md: '401px', // Change `md` to start at 850px instead of 768px
            ph: { max: '400px' }, // Custom media query for phone screens
        },
    },
  plugins: [],
}
}

