/**
 * @file postcss.config.js
 * @description PostCSS configuration for BloodLink AI.
 * Enables Tailwind CSS nesting, Tailwind core engine, and Autoprefixer vendor prefixes.
 */

module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
