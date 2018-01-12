export default {
  methods: {
    unescapeSymbols (v) {
      let htmlOutput = ''
      let isSymbol = false
      if (v.indexOf('$') > -1) {
        // The string has symbols
        for (let i=0; i<v.length; i++) {
          if (isSymbol) {
            // This is a symbol, escape it and wrap it in a span with the right font
            htmlOutput += '<span class="symbols-font">' + this.htmlEntities(v[i]) + '</span>'
            isSymbol = false
          } else if (v[i] === '$') {
            // Next char is a symbol, but don't put the $
            isSymbol = true
          } else {
            // Normal char
            htmlOutput += v[i]
          }
        }
      } else {
        // No symbols
        htmlOutput = v
      }
      return htmlOutput
    }
  }
}
