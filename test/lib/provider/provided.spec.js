const expect = require('chai').expect
const provided = require('../../../lib/provider/provided')

describe('provided', () => {
  it('should read vars from provided object', done => {
    const keyToCheck = 'testKey'
    const varToCheck = 'testVar'

    provided.init({variables: {testKey: varToCheck}}, (err, provider) => {
      provider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        done()
      })
    })
  })
})
