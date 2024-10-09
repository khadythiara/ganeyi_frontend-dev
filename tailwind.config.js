module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#339682',
        secondary: '#3e5362',
        dark: '#263238',
        marron: '#513934'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
