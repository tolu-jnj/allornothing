/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.10)',
          200: 'rgba(255, 255, 255, 0.20)',
          400: 'rgba(255, 255, 255, 0.40)',
        },
        neon: {
          green: '#00ff88',
          red: '#ff4444',
          cyan: '#00ffff',
          purple: '#cc44ff',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 255, 136, 0.4)',
        'glow-red': '0 0 20px rgba(255, 68, 68, 0.4)',
        'glow-cyan': '0 0 30px rgba(0, 255, 255, 0.3)',
        neon: '0 0 50px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-fall': 'bounce-fall 0.6s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 50px rgba(0, 255, 136, 0.8)' },
        },
        'bounce-fall': {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '60%': { transform: 'translateY(10px)' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        '.glass': {
          '@apply bg-white/5 backdrop-blur-xl md:backdrop-blur-2xl border border-white/20 rounded-2xl shadow-neon':
            {},
        },
        '.glass-sm': {
          '@apply bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg shadow-md':
            {},
        },
        '.glass-card': {
          '@apply bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl ring-1 ring-white/10':
            {},
        },
      });
    },
  ],
};
