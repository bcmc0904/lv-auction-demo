module.exports = {
  plugins: {
    tailwindcss: {},
    'postcss-nested': {rootRuleName: '_escape-nesting'},
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace'
    },
  },
}
