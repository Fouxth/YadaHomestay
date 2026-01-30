/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Resort Theme Colors - Natural, Calm, Premium
                primary: {
                    DEFAULT: '#2F5D50',
                    hover: '#4A7C6D',
                    light: 'rgba(47, 93, 80, 0.1)',
                    medium: 'rgba(47, 93, 80, 0.5)',
                },
                accent: {
                    DEFAULT: '#C2A97E',
                    hover: '#A88B5A',
                    light: 'rgba(194, 169, 126, 0.1)',
                },
                resort: {
                    bg: '#FAF9F6',
                    card: '#FFFFFF',
                    warm: '#F5F3EF',
                    border: '#E5E2DC',
                },
                text: {
                    primary: '#1F2933',
                    secondary: '#6B7280',
                    muted: 'rgba(107, 114, 128, 0.6)',
                },
                // Legacy colors for admin compatibility
                secondary_legacy: '#D4A574',
                accent_legacy: '#E8B86D',
                background_legacy: '#FAF7F2',
            },
            fontFamily: {
                sans: ['Noto Sans Thai', 'sans-serif'],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to bottom, rgba(47, 93, 80, 0.7) 0%, rgba(47, 93, 80, 0.4) 50%, rgba(47, 93, 80, 0.6) 100%)',
            },
            boxShadow: {
                'resort': '0 4px 20px rgba(31, 41, 51, 0.08)',
                'resort-lg': '0 8px 30px rgba(31, 41, 51, 0.12)',
                'resort-primary': '0 4px 12px rgba(47, 93, 80, 0.3)',
            },
        },
    },
    plugins: [],
}
