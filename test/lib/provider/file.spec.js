const assert = require('assert')
const fs = require('fs')
const file = require('../../../lib/provider/file')

const keyToCheck = 'testKey'
const varToCheck = 'testVar'

const numberKeyToCheck = 'numberTestKey'
const numberVarToCheck = 123

const boolKeyToCheck = 'boolTestKey'
const boolVarToCheck = false

const content = `${keyToCheck}=${varToCheck}\n${numberKeyToCheck}=${numberVarToCheck}\n${boolKeyToCheck}=${boolVarToCheck}`

const cleanUp = f => {
  try {
    f()
  } finally {
    fs.unlinkSync('./testFile')
  }
}

fs.writeFileSync('./testFile', content)

file.init({path: './testFile', format: 'property'}, (err, provider) => {
  provider.read((err, res) => cleanUp(() => {
    assert.equal(res[keyToCheck], varToCheck, 'Provided variables not found / not matching.')
    assert.equal(res[numberKeyToCheck], numberVarToCheck, 'Provided variables not found / not matching.')
    assert.equal(res[boolKeyToCheck], boolVarToCheck, 'Provided variables not found / not matching.')
  }))
})
