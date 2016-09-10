const expect = require('chai').expect
const env = require('../../../lib/provider/env')

describe('env', () => {
  it('should read env vars from process.env', done => {
    const keyToCheck = 'testKey'
    const varToCheck = 'testVar'

    process.env[keyToCheck] = varToCheck

    env.init({}, (err, envProvider) => {
      envProvider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        done()
      })
    })
  })
})
