const expect = require('chai').expect
const fs = require('fs')
const file = require('../../../lib/provider/file')

describe('file', () => {
  const keyToCheck = 'testKey'
  const varToCheck = 'testVar'

  const numberKeyToCheck = 'numberTestKey'
  const numberVarToCheck = 123

  const boolKeyToCheck = 'boolTestKey'
  const boolVarToCheck = false

  afterEach(() => {
    fs.unlinkSync('./testFile')
  })

  it('should read env vars from file when using property format', done => {
    const content = `${keyToCheck}=${varToCheck}\n${numberKeyToCheck}=${numberVarToCheck}\n${boolKeyToCheck}=${boolVarToCheck}`

    fs.writeFileSync('./testFile', content)

    file.init({path: './testFile', format: 'property'}, (err, provider) => {
      provider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        expect(res[numberKeyToCheck]).to.equal(numberVarToCheck)
        expect(res[boolKeyToCheck]).to.equal(boolVarToCheck)
        done()
      })
    })
  })

  it('should read env vars from file when using json format', done => {
    const content = {}
    content[keyToCheck] = varToCheck
    content[numberKeyToCheck] = numberVarToCheck
    content[boolKeyToCheck] = boolVarToCheck

    fs.writeFileSync('./testFile', JSON.stringify(content))

    file.init({path: './testFile', format: 'json'}, (err, provider) => {
      provider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        expect(res[numberKeyToCheck]).to.equal(numberVarToCheck)
        expect(res[boolKeyToCheck]).to.equal(boolVarToCheck)
        done()
      })
    })
  })

  it('should read env vars having nested json structure from file when using json format', done => {
    const content = {this: {is: {nested: 123}}}

    fs.writeFileSync('./testFile', JSON.stringify(content))

    file.init({path: './testFile', format: 'json'}, (err, provider) => {
      provider.read((err, res) => {
        expect(res.this.is.nested).to.equal(123)
        done()
      })
    })
  })
})
