/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neural: {
          // Exact hex values as specified
          background: '#0A0F1C',   // Navy background
          card: '#111726',         // Card background
          accent: '#C87933',       // Copper for CTAs/accents
          accentHover: '#D98324',  // Burnt orange (CTA hover)
          accentLight: '#DA8F3B',  // Lighter hover state 
          text: '#F3ECDC',         // Cream text
          muted: '#9BA4B5',        // Muted gray for helper text
          error: '#C84C44',        // Warm red for errors
          disabled: '#6B4D36',     // Disabled button state
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'copper': '0 0 2px 2px rgba(203,121,51,0.35)',
        'focus': '0 0 0 2px rgba(243,236,220,0.6), 0 0 0 3px rgba(200,121,51,1)',
      },
      letterSpacing: {
        'wide': '2px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
