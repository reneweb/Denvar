const assert = require('assert')
const dvar = require('../index')

const tests = {
  shouldProvideEnvVarsBasedOnConfig: () => {
    dvar.configure([{type: 'provided', variables: {test: 123}}], (err, res) => {
      assert.equal(res.get('test'), 123)
    })
  },

  shouldProvideEnvVarsFromMultipleSources: () => {
    process.env.testEnv = 456

    dvar.configure([
      {type: 'provided', variables: {test: 123}},
      {type: 'env'},
      {type: 'provided', variables: {anotherOne: 'someString'}}
    ], (err, res) => {
      assert.equal(res.get('test'), 123)
      assert.equal(res.get('testEnv'), 456)
      assert.equal(res.get('anotherOne'), 'someString')
    })
  },

  shouldOverrideProvidedEnvVarsBasedOnConfigOrder: () => {
    process.env.test = 456

    dvar.configure([
      {type: 'provided', variables: {test: 123, anotherOne: 'firstString', noChange: true}},
      {type: 'env'},
      {type: 'provided', variables: {anotherOne: 'someString'}}
    ], (err, res) => {
      assert.equal(res.get('test'), 456)
      assert.equal(res.get('anotherOne'), 'someString')
      assert.equal(res.get('noChange'), true)
    })
  },

  shouldFailIfUnknownProvider: () => {
    dvar.configure([
      {type: 'non-existent-provider'}
    ], (err, res) => {
      assert.ok(err instanceof Error)
      assert.ok(typeof res === 'undefined')
    })
  },

  shouldFailIfErrorWhileReadingFromProvider: () => {
    dvar.configure([
      {type: 'file', path: 'does-not-exist'}
    ], (err, res) => {
      assert.ok(err instanceof Error)
      assert.ok(typeof res === 'undefined')
    })
  }
}

tests[process.argv[2]]()
