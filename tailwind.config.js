module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          900: '#202225',
          800: '#2F3136',
          700: '#36393F',
          600: '#4F545C',
          500: '#B4B7BC',
          400: '#D4D7DC',
          300: '#E3E5E8',
          200: '#EBEDEF',
          100: '#F2F3F5',
        },
        blue: {
          900: '#0F1322',
          800: '#1A2035',
          700: '#212843',
          600: '#28314D',
          500: '#30395A',
        },
        cyan: {
          900: '#15212F',
          700: '#1F424E',
        }
      }
    },
  },
  plugins: [],
}
