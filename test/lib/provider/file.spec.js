const assert = require('assert')
const fs = require('fs')
const file = require('../../../lib/provider/file')

const keyToCheck = 'testKey'
const varToCheck = 'testVar'

const cleanUp = f => {
  try {
    f()
  } finally {
    fs.unlinkSync('./testFile')
  }
}

fs.writeFileSync('./testFile', `${keyToCheck}=${varToCheck}`)

file.init({path: './testFile', format: 'property'}, (err, provider) => {
  provider.read((err, res) => cleanUp(() =>
    assert.equal(res[keyToCheck], varToCheck, 'Provided variables not found / not matching.')
  ))
})
