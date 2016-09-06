const assert = require('assert')
const provided = require('../../../lib/provider/provided')

const keyToCheck = 'testKey'
const varToCheck = 'testVar'

provided.init({variables: {testKey: varToCheck}}, (err, provider) => {
  provider.read((err, res) => {
    assert.equal(res[keyToCheck], varToCheck, 'Provided variables not found / not matching.')
  })
})
