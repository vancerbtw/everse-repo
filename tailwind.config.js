module.exports = {
  important: true,
  theme: {
    extend: {
      borderRadius: {
        "xl": "1rem"
      },
      height: {
        "screen-16": "16vh",
        "screen-33": "33vh",
        "screen-50": "50vh",
        "screen-40": "40vh",
        "screen-45": "45vh",
        "screen-75": "75vh",
        "screen-85": "85vh",
        "percent-110": "110%"
      },
      translate: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '-42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        '9/10': '90%'
      }
    }
  },
  variants: {
    opacity: ['responsive', 'hover']
  }
}