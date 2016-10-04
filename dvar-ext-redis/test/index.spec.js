/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const rewire = require('rewire')
const dvarRedis = rewire('../index')

describe('dvar-ext-redis', () => {
  const keyToCheck = 'testKey'
  const varToCheck = 'testValue'
  const propObj = {}
  propObj[keyToCheck] = varToCheck

  it('should read config from redis', done => {
    const redisMock = dvarRedis.__get__('redis')

    redisMock.createClient = opt => {
      return {
        get: (key, cb) => key === 'test' ? cb(null, propObj) : cb()
      }
    }

    dvarRedis.init({
      host: 'localhost',
      port: 9111,
      key: 'test'
    }, (err, provider) => {
      provider.read((err, res) => {
        expect(res[keyToCheck]).to.equal(varToCheck)
        done()
      })
    })
  })

  it('should return error if problem with server', done => {
    const redisMock = dvarRedis.__get__('redis')
    redisMock.createClient = opt => {
      return {
        get: (key, cb) => cb(new Error())
      }
    }

    dvarRedis.init({
      host: 'localhost',
      port: 9111
    }, (err, provider) => {
      provider.read((err, res) => {
        expect(err).to.be.defined
        done()
      })
    })
  })
})
