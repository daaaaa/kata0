const R = require('ramda')
const fs = require('fs')
const shuffle = require('shuffle-array')

const { stringInSequence, isValidSequence } = require('./solutions/solution-ramda')

const one =
  `   
  |
  |
`
const two =
  ` _ 
 _|
|_ 
`
const three =
  ` _ 
 _|
 _|
`

const four =
  `   
|_|
  |
`

const five =
  ` _ 
|_ 
 _|
`

const six =
  ` _ 
|_ 
|_|
`

const seven =
  ` _ 
  |
  |
`

const eight =
  ` _ 
|_|
|_|
`

const nine =
  ` _ 
|_|
 _|
`

const zero =
  ` _ 
| |
|_|
`

const numberToFigure = new Map([
  ['1', one],
  ['2', two],
  ['3', three],
  ['4', four],
  ['5', five],
  ['6', six],
  ['7', seven],
  ['8', eight],
  ['9', nine],
  ['0', zero],
])

const randomNumber = () => Math.floor(Math.random() * 10)
const randomFigure = () => numberToFigure.get(
  randomNumber().toString()
)
const joinNumbers = (first, second) => {
  const firstSplitted = first.split('\n')
  const secondSplitted = second.split('\n')
  const newString = []
  let i = 0
  while (i < 3) {
    newString[i] = firstSplitted[i] + secondSplitted[i] + '\n'
    i++
  }
  return newString.join('')
}

const extractAccountNumber = () => {
  let i = 0
  const numbers = []
  while (i < 9) {
    numbers.push(randomFigure())
    i++
  }
  return numbers
}

const generateAccountNumber = () => extractAccountNumber()
  .reduce(joinNumbers)

const generateValidOrInvalidSequence = (isValid) => {
  let sequence
  let accountNumber
  do {
    accountNumber = generateAccountNumber()
    sequence = stringInSequence(accountNumber)
  } while (isValidSequence(sequence) !== isValid)
  return {
    sequence,
    accountNumber,
    isValid,
  }
}

const generateGivenNumberOfDesiredSequence = (number, isValid) => {
  const accumulator = []
  while (number--) {
    accumulator.push(generateValidOrInvalidSequence(isValid))
  }
  return accumulator
}

const generateGivenNumberOfValidSequence = (number) => {
  return generateGivenNumberOfDesiredSequence(number, true)
}

const generateGivenNumberOfInvalidSequence = (number) => {
  return generateGivenNumberOfDesiredSequence(number, false)
}

const generatePotentialIllegibleSequence = () => {
  const sequence = generateValidOrInvalidSequence(
    Math.random() >= 0.5)
  const simpleRandomOfNumber = number => Math.floor(
    Math.random() * number
  )
  let rightIndex
  let foundChar
  do {
    rightIndex = simpleRandomOfNumber(sequence.accountNumber.length)
    foundChar = sequence.accountNumber[rightIndex]
  } while (foundChar === '\n')
  const charsRemaining = R.without(
    [foundChar],
    ['_', '|', ' '],
  )
  const toSubstitute = charsRemaining[simpleRandomOfNumber(2)]
  return {
    ...sequence,
    wrongAccountNumber: R.update(rightIndex, toSubstitute, sequence.accountNumber).join('')
  }
}

// this generate at most one invalid character
const generateIllegibleSequence = () => {
  let sequence
  let accountNumber
  let wrongSequence
  do {
    sequence = generatePotentialIllegibleSequence()
    accountNumber = sequence.wrongAccountNumber
    wrongSequence = sequenceValidator(accountNumber).response.sequence
  } while (!wrongSequence.includes('?'))
  return {
    ...sequence,
    wrongSequence,
  }
}

const generateGivenNumberOfIllegibleSequence = (number) => {
  const accumulator = []
  while (number--) {
    accumulator.push(generateIllegibleSequence())
  }
  return accumulator
}

if (process.argv[2] === '1') {
  /*
  // generate use-case-1
  */
  const generated = generateGivenNumberOfValidSequence(5)
  generated
    .forEach(({ sequence, accountNumber }, index) => {
      // console.log(accountNumber.split('\n'))
      fs.writeFileSync(
        `./use-case-1/input${index + 1}.txt`,
        accountNumber)
      fs.writeFileSync(
        `./use-case-1/output${index + 1}.txt`,
        sequence)
    })
  /*
  //
   */
} else if (process.argv[2] === '2') {
  /*
// generate use-case-2
 */
  const generated = generateGivenNumberOfValidSequence(20)
  const [input, output] = generated
    .reduce(([string, array], { sequence, accountNumber }, index) => {
      return [
        [string, accountNumber].join('\n'),
        [...array, sequence]
      ]
    }, [[], ''])
  const [remove, ...rest] = input
  fs.writeFileSync(
    `./use-case-2/input.txt`,
    rest.join(''))
  fs.writeFileSync(
    `./use-case-2/output.txt`,
    output.join('\n'))
  /*
  //
   */
} else if (process.argv[2] === '3') {
  /*
  // generate use-case-3
   */
  const generated = shuffle([
    ...generateGivenNumberOfValidSequence(20),
    ...generateGivenNumberOfInvalidSequence(20)
  ])
  const [input, output] = generated
    .reduce(([string, array], { sequence, accountNumber, isValid }) => {
      return [
        [string, accountNumber].join('\n'),
        [...array, sequence + (isValid ? '' : ' ERR')]
      ]
    }, [[], ''])
  const [remove, ...rest] = input
  fs.writeFileSync(
    `./use-case-3/input.txt`,
    rest.join(''))
  fs.writeFileSync(
    `./use-case-3/output.txt`,
    output.join('\n'))
  /*
  //
   */
} else if (process.argv[2] === '4') {
  /*
  // generate use-case-4
   */
  const generated = shuffle([
    ...generateGivenNumberOfValidSequence(10),
    ...generateGivenNumberOfInvalidSequence(10),
    ...generateGivenNumberOfIllegibleSequence(10),
  ])
  const [input, output] = generated
    .reduce(([string, array], { wrongSequence, sequence, accountNumber, wrongAccountNumber, isValid }) => {
      let stringToAdd
      let sequenceToAdd = sequence
      if (wrongAccountNumber) {
        stringToAdd = ' ILL'
        sequenceToAdd = wrongSequence
      } else if (isValid) {
        stringToAdd = ''
      } else {
        stringToAdd = ' ERR'
      }
      return [
        [string, (wrongAccountNumber ? wrongAccountNumber : accountNumber)].join('\n'),
        [...array, sequenceToAdd + stringToAdd]
      ]
    }, [[], ''])
  const [remove, ...rest] = input
  fs.writeFileSync(
    `./use-case-4/input.txt`,
    rest.join(''))
  fs.writeFileSync(
    `./use-case-4/output.txt`,
    output.join('\n'))
} else {
  console.log('Invalid use case.')
  console.log('You have to specify one of this number as parameter')
  console.log('1')
  console.log('2')
  console.log('3')
  console.log('4')
  console.log('Example: node createRandomSequence.js 2')
}






