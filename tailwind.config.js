/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#0b0b0f",
                "accent-gold": "#D4AF37",
                "accent-gold-light": "#F9E076",
                "gold-start": "#D4AF37",
                "gold-end": "#FFD700",
                "silver": "#C0C0C0",
                "background-light": "#f7f7f7",
                "background-dark": "#17171b",
                "card-glass": "rgba(23, 23, 27, 0.7)",
                "gold-glow": "#D4AF37",
                "gold-bright": "#FFD700",
            },
            fontFamily: {
                "sans": ["Inter", "sans-serif"],
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
