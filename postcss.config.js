module.exports = {
  plugins: {
    "tailwindcss": {},
    ...(process.env.NODE_ENV === "production"
    ? {
      "@fullhuman/postcss-purgecss": {
        content: [
          "./pages/**/*.{js,jsx,ts,tsx}",
          "./components/**/*.{js,jsx,ts,tsx}",
        ],
        defaultExtractor: e => e.match(/[\w-/:]+(?<!:)/g) || [],
      }
    }
    : {}),
    "postcss-normalize": {},
    "autoprefixer": {}
  },
}