const expect = require('chai').expect
const http = require('http')
const httpProvider = require('../../../lib/provider/http')

describe('http', () => {
  const keyToCheck = 'testKey'
  const varToCheck = 'testVar'

  const numberKeyToCheck = 'numberTestKey'
  const numberVarToCheck = 123

  const boolKeyToCheck = 'boolTestKey'
  const boolVarToCheck = false

  const contentProperty = `${keyToCheck}=${varToCheck}\n${numberKeyToCheck}=${numberVarToCheck}\n${boolKeyToCheck}=${boolVarToCheck}`

  const contentJson = {}
  contentJson[keyToCheck] = varToCheck
  contentJson[numberKeyToCheck] = numberVarToCheck
  contentJson[boolKeyToCheck] = boolVarToCheck

  const contentJsonNested = {this: {is: {nested: 123}}}

  before(() => {
    http.createServer(function(request, response) {
      var url = request.url

      if (url.endsWith('json')) {
        response.end(JSON.stringify(contentJson))
      } else if (url.endsWith('property')) {
        response.end(contentProperty)
      } else if (url.endsWith('jsonNested')) {
        response.end(JSON.stringify(contentJsonNested))
      }
    }).listen(9111)
  })

  it('should request env vars from http when using property format', done => {
    httpProvider.init({url: 'http://localhost:9111/property', format: 'property'}, (err, provider) => {
      provider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        expect(res[numberKeyToCheck]).to.equal(numberVarToCheck)
        expect(res[boolKeyToCheck]).to.equal(boolVarToCheck)
        done()
      })
    })
  })

  it('should request env vars from http when using json format', done => {
    httpProvider.init({url: 'http://localhost:9111/json', format: 'json'}, (err, provider) => {
      provider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        expect(res[numberKeyToCheck]).to.equal(numberVarToCheck)
        expect(res[boolKeyToCheck]).to.equal(boolVarToCheck)
        done()
      })
    })
  })

  it('should request env vars having nested json structure from http when using json format', done => {
    httpProvider.init({url: 'http://localhost:9111/jsonNested', format: 'json'}, (err, provider) => {
      provider.read((err, res) => {
        expect(res.this.is.nested).to.equal(123)
        done()
      })
    })
  })
})
