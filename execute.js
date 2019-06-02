const fs = require('fs')
const input = fs.readFileSync(`./${process.argv[2]}`, 'utf8')

console.log(
  require('./parser.js').stringsInSequences(input)
)
