const R = require('ramda')

const BACKSPACE = '\n'

// const chars = '    _  _     _  _  _  _  _ \n' +
//   '  | _| _||_||_ |_   ||_||_|\n' +
//   '  ||_  _|  | _||_|  ||_| _|\n'

const log = (LOG_NAME = '') => toLog => {
  console.log(LOG_NAME, toLog)
  return toLog
}

const reduceI = R.addIndex(R.reduce)

const removeLastLine = R.dropLast(1)
const groupCharListByThreeInNineGroups = reduceI(
  (acc, char, index) => {
    const cell = Math.floor(index / 3 % 9)
    return R.update(
      cell,
      R.append(char, acc[cell]),
      acc)
  }, [[], [], [], [], [], [], [], [], []])

const splitInDigits = R.pipe(
  R.split(BACKSPACE),
  removeLastLine,
  R.map(R.split('')),
  R.flatten,
  groupCharListByThreeInNineGroups,
  R.map(R.join(''))
)

const digitTranslator = {
  ' _ | ||_|': 0,
  '     |  |': 1,
  ' _  _||_ ': 2,
  ' _  _| _|': 3,
  '   |_|  |': 4,
  ' _ |_  _|': 5,
  ' _ |_ |_|': 6,
  ' _   |  |': 7,
  ' _ |_||_|': 8,
  ' _ |_| _|': 9,
}

const transformDigitCharInNumber = R.flip(
  R.propOr('?')
)(digitTranslator)

const stringInSequence = R.pipe(
  splitInDigits,
  R.map(transformDigitCharInNumber),
  R.join(''),
)

const isValidSequence = R.pipe(
  R.split(''),
  reduceI((acc, next, i) => {
    return acc + +next * (9 - i)
  }, 0),
  mod11 => mod11 % 11,
  R.equals(0),
)

const stringsInSequences = R.pipe(
  R.split('\n\n'),
  (arr) => R.adjust(
    R.length(arr) - 1,
    lastSequence => R.dropLast(1, lastSequence),
    arr,
  ),
  R.map(R.flip(R.concat)('\n')),
  R.map(stringInSequence),
)

const stringInSequencesWithValidation = R.pipe(
  stringsInSequences,
  R.map(
    R.ifElse(
      isValidSequence,
      R.identity,
      R.ifElse(
        R.includes('?'),
        R.flip(R.concat)(' ILL'),
        R.flip(R.concat)(' ERR'),
      )
    )
  ),
  R.join('\n')
)

module.exports = {
  stringInSequence,
  stringsInSequences,
  stringInSequencesWithValidation,
  isValidSequence,
}
