import { colors } from './src/tokens/colors.js';
import { fontFamily } from './src/tokens/typography.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,php}",
    "./*.{html,js,php}"
  ],
  theme: {
    extend: {
      fontFamily: fontFamily,
      colors: colors
    },
  },
  plugins: [],
}
