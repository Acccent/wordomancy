module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  presets: [require('./src/1_styles/twpreset.config.js')],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
