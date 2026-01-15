/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0ea5e9', // Sky blue
                secondary: '#6366f1', // Indigo
                accent: '#f43f5e', // Rose
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
            }
        },
    },
    plugins: [],
}
