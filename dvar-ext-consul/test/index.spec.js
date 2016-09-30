/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const dvarConsul = require('../index')
const http = require('http')

describe('dvar-ext-consul', () => {
  const keyToCheck = 'testKey'
  const varToCheck = 'testValue'

  const contentJson = [{
    CreateIndex: 6,
    ModifyIndex: 6,
    LockIndex: 0,
    Key: keyToCheck,
    Flags: 0,
    Value: new Buffer(varToCheck).toString('base64')
  }]

  before(() => {
    http.createServer(function(request, response) {
      var url = request.url
      if (url.startsWith('/v1/kv/test')) {
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.end(JSON.stringify(contentJson))
      } else {
        response.status = 500
        response.end()
      }
    }).listen(9111)
  })

  it('should read config from consul', done => {
    dvarConsul.init({
      host: 'localhost',
      port: 9111,
      secure: false,
      keyPrefix: 'test'
    }, (err, provider) => {
      provider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        done()
      })
    })
  })

  it('should return error if problem with server', done => {
    dvarConsul.init({
      host: 'localhost',
      port: 9112,
      secure: false,
      keyPrefix: 'test'
    }, (err, provider) => {
      provider.read((err, res) => {
        expect(err).to.be.defined
        done()
      })
    })
  })
})
