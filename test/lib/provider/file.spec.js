const assert = require('assert')
const fs = require('fs')
const file = require('../../lib/provider/file')

const keyToCheck = "testKey"
const varToCheck = "testVar"

fs.writeFileSync('./testFile', `${keyToCheck}=${varToCheck}`)

file.init({path: './testFile'}, (err, provider) => {
  provider.read((err, res) => cleanUp(() => {
    assert.equal(res[keyToCheck], varToCheck, "Provided variables not found / not matching.")
  })
})

function cleanUp(f) {
  try {
    f()
  } finally {
    fs.unlinkSync('./testFile')
  }
}
