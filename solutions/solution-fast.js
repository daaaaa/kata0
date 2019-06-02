const BACKSPACE = '\n'

const digitTranslater = new Map([
  [ ' ', '_', ' ', '|', ' ', '|', '|', '_', '|' ],
  [ ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', '|' ],
  [ ' ', '_', ' ', ' ', '_', '|', '|', '_', ' ' ],
  [ ' ', '_', ' ', ' ', '_', '|', ' ', '_', '|' ],
  [ ' ', ' ', ' ', '|', '_', '|', ' ', ' ', '|' ],
  [ ' ', '_', ' ', '|', '_', ' ', ' ', '_', '|' ],
  [ ' ', '_', ' ', '|', '_', ' ', '|', '_', '|' ],
  [ ' ', '_', ' ', ' ', ' ', '|', ' ', ' ', '|' ],
  [ ' ', '_', ' ', '|', '_', '|', '|', '_', '|' ],
  [ ' ', '_', ' ', '|', '_', '|', ' ', '_', '|' ],
]
  .map((array, i) => [array.join(''), i]))

module.exports = (input) => {
  const lines = input.split(BACKSPACE)

  const digitDivision = lines
    .reduce((acc, next, i) => {
      if (i === 4) {
        return acc
      }

      next.split('').forEach((c, j) => {
        const cell = Math.floor(j / 3)
        acc[cell].push(c)
      })
      return acc
    }, [[], [], [], [], [], [], [], [], []])

  const sequence = digitDivision
    .map(digit => {
      const digitFound = digitTranslater.get(digit.join(''))
      return digitFound !== undefined ? digitFound : '?'
    })
    .join('')

  const validSequence = sequence
    .split('')
    .reduce((acc, next, i) => {
      return acc + +next * (9 - i)
    }, 0) % 11 === 0

  return {
    sequence,
    validSequence,
  }
}
