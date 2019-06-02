const assert = require('assert')
const { readFileSync } = require('fs')
const path = require('path')

const {
  stringInSequence,
  stringsInSequences,
  stringInSequencesWithValidation,
} = require('./solutions/solution-ramda')

const readInput = (fileName) => {
  return readFileSync(
    path.join(
      __dirname,
      fileName),
    'utf8')
}

const tests = [
  {
    name: 'use case one',
    execute: () => {
      const input = [1, 2, 3, 4]
      input.forEach((index) => {
        const input = readInput(`./use-case-1/input${index}.txt`)
        const output = readInput(`./use-case-1/output${index}.txt`)
        const result = stringInSequencesWithValidation(input)
        assert.deepStrictEqual(result, output, `Input sequence: ${index}`)
      })
    }
  },
  {
    name: 'use case two',
    execute: () => {
      const input = readInput(`./use-case-2/input.txt`)
      const output = readInput(`./use-case-2/output.txt`)
      const result = stringInSequencesWithValidation(input)
      assert.deepStrictEqual(result, output, `Failed`)
    }
  },
  {
    name: 'use case three',
    execute: () => {
      const input = readInput(`./use-case-3/input.txt`)
      const output = readInput(`./use-case-3/output.txt`)
      const result = stringInSequencesWithValidation(input)
      assert.deepStrictEqual(result, output, `Failed`)

    }
  },
  {
    name: 'use case four',
    execute: () => {
      const input = readInput(`./use-case-4/input.txt`)
      const output = readInput(`./use-case-4/output.txt`)
      const result = stringInSequencesWithValidation(input)
      assert.deepStrictEqual(result, output, `Failed`)

    }
  }
]

tests
  .map(({ name, execute }) => {
    try {
      execute()
      console.log(name, 'passed')
    } catch (error) {
      console.log(name, 'failed')
      console.log(error)
    }
  })

