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
                    700: '#333333', // Dark Gray for hover
                    800: '#1a1a1a', // Primary Dark (Not pure black)
                    900: '#0f0f0f', // Darker shade
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
