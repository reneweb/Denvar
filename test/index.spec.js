/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const dvar = require('../index')

describe('dvar', () => {
  it('should provide env vars based on config', () => {
    dvar.configure([{type: 'provided', variables: {test: 123}}], (err, res) => {
      expect(res.get('test')).to.equal(123)
    })
  })

  it('should provide env vars from multiple sources', () => {
    process.env.testEnv = 456

    dvar.configure([
      {type: 'provided', variables: {test: 123}},
      {type: 'env'},
      {type: 'provided', variables: {anotherOne: 'someString'}}
    ], (err, res) => {
      expect(res.get('test')).to.equal(123)
      expect(res.get('testEnv')).to.equal('456')
      expect(res.get('anotherOne')).to.equal('someString')
    })
  })

  it('should override provided env vars based on config order', () => {
    process.env.test = 456

    dvar.configure([
      {type: 'provided', variables: {test: 123, anotherOne: 'firstString', noChange: true}},
      {type: 'env'},
      {type: 'provided', variables: {anotherOne: 'someString'}}
    ], (err, res) => {
      expect(res.get('test')).to.equal('456')
      expect(res.get('anotherOne')).to.equal('someString')
      expect(res.get('noChange')).to.equal(true)
    })
  })

  it('should fail if unknown provider', () => {
    dvar.configure([
      {type: 'non-existent-provider'}
    ], (err, res) => {
      expect(err instanceof Error).to.be.true
      expect(typeof res === 'undefined').to.be.true
    })
  })

  it('should fail if error while reading from provider', () => {
    dvar.configure([
      {type: 'file', path: 'does-not-exist'}
    ], (err, res) => {
      expect(err instanceof Error).to.be.true
      expect(typeof res === 'undefined').to.be.true
    })
  })
})
