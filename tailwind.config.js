/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'green': {
                    800: '#1a4d2e',
                    900: '#0f2f1c',
                }
            },
            fontFamily: {
                'heading': ['Anton', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
