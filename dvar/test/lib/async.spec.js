/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const async = require('../../lib/async')

describe('async', () => {
  it('should merge multiple async funcs into one', done => {
    const functions = [cb => cb(null, 1), cb => cb(null, 2), cb => cb(null, 3)]

    async.merge(functions, results => {
      expect(results[0].res).to.equal(1)
      expect(results[1].res).to.equal(2)
      expect(results[2].res).to.equal(3)
      done()
    })
  })

  it('should return empty result when array of functions empty', done => {
    const functions = []

    async.merge(functions, results => {
      expect(results).to.be.empty
      done()
    })
  })
})
