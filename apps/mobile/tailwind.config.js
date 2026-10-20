/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF4D8D',
          orange: '#FF8A00',
          purple: {
            mid: '#5A1E6C',
            dark: '#2D1140',
          },
          'off-white': '#F9F7FB',
        },
      },
    },
  },
  plugins: [],
};
