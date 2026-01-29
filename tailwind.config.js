/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2D5A4A',
                secondary: '#D4A574',
                accent: '#E8B86D',
                background: '#FAF7F2',
            },
            fontFamily: {
                sans: ['Noto Sans Thai', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
