const assert = require('assert')
const env = require('../../../lib/provider/env')

const keyToCheck = 'testKey'
const varToCheck = 'testVar'

process.env[keyToCheck] = varToCheck

env.init({}, (err, envProvider) => {
  envProvider.read((err, res) => {
    assert.equal(res[keyToCheck], varToCheck, 'Env variables not found / not matching.')
  })
})
