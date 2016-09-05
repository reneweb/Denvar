const assert = require('assert');
const denvar = require('../index')

const tests = {
  shouldProvideEnvVarsBasedOnConfig: function () {
    denvar.configure([{type: 'provided', variables: {test: 123}}], (err, res) => {
      assert.equal(res.get('test'), 123)
    })
  },

  shouldProvideEnvVarsFromMultipleSources: function () {
    process.env['testEnv'] = 456

    denvar.configure([
      {type: 'provided', variables: {test: 123}},
      {type: 'env'},
      {type: 'provided', variables: {anotherOne: 'someString'}}
    ], (err, res) => {
      assert.equal(res.get('test'), 123)
      assert.equal(res.get('testEnv'), 456)
      assert.equal(res.get('anotherOne'), 'someString')
    })
  },

  shouldOverrideProvidedEnvVarsBasedOnConfigOrder: function () {
    process.env['test'] = 456

    denvar.configure([
      {type: 'provided', variables: {test: 123, anotherOne: 'firstString', noChange: true}},
      {type: 'env'},
      {type: 'provided', variables: {anotherOne: 'someString'}}
    ], (err, res) => {
      assert.equal(res.get('test'), 456)
      assert.equal(res.get('anotherOne'), 'someString')
      assert.equal(res.get('noChange'), true)
    })
  },

  shouldFailIfUnknownProvider: function () {
    denvar.configure([
      {type: 'non-existent-provider'}
    ], (err, res) => {
      assert.ok(err instanceof Error)
      assert.ok(typeof res === 'undefined')
    })
  },

  shouldFailIfErrorWhileReadingFromProvider: function () {
    denvar.configure([
      {type: 'file', path: 'does-not-exist'}
    ], (err, res) => {
      assert.ok(err instanceof Error)
      assert.ok(typeof res === 'undefined')
    })
  }
}

tests[process.argv[2]]()
