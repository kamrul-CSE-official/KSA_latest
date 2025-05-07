export default {
    darkMode: 'class',
    content: ['./src/**/*.{html,js,css, ts, tsx}'], 
    theme: {
      extend: {
        animation: {
          'theme-fade': 'theme-fade 0.5s ease-in-out',
        },
        keyframes: {
          'theme-fade': {
            '0%': { opacity: '0.8', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          }
        }
      }
    }
  }