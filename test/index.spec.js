/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const dvar = require('../index')

describe('dvar', () => {
  it('should provide env vars based on config', () => {
    dvar.configure([{type: 'provided', variables: {test: 123}}], (err, res) => {
      expect(res.get('test')).to.equal(123)
    })
  })

  it('should return all env vars when using all function', () => {
    dvar.configure([{type: 'provided', variables: {test: 123, test2: 'hello'}}], (err, res) => {
      expect(res.all().test).to.equal(123)
      expect(res.all().test2).to.equal('hello')
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

  it('should replace keys if option is set', () => {
    dvar.configure(
      [{type: 'provided', variables: {test: 123}}],
      {replaceKeys: key => key + '-suffix'},
      (err, res) => {
        expect(res.get('test-suffix')).to.equal(123)
      })
  })

  it('should replace values if option is set', () => {
    dvar.configure(
      [{type: 'provided', variables: {test: 123}}],
      {replaceValues: value => value + '-suffix'},
      (err, res) => {
        expect(res.get('test')).to.equal('123-suffix')
      })
  })

  it('should use override config if set before actual config', () => {
    dvar.override(
      [{type: 'provided', variables: {test: 'override'}}],
      (err, res) => {
        expect(res.get('test')).to.equal('override')
      })

    dvar.configure(
      [{type: 'provided', variables: {test: 123}}],
      (err, res) => {
        expect(res.get('test')).to.equal('override')
      })

    dvar.removeOverride()
  })

  it('should use extension when registered and used', () => {
    dvar.addExtension('myExt', {init: (config, cb) => {
      const readF = cb => cb(null, {test: 123})
      cb(null, {read: readF})
    }}).configure([
      {type: 'myExt'}
    ], (err, res) => {
      expect(res.get('test')).to.equal(123)
    })
  })

  it('should use extension in place of other provider is same type', () => {
    dvar.addExtension('provided', {init: (config, cb) => {
      const readF = cb => cb(null, {test: 123})
      cb(null, {read: readF})
    }}).configure([
      {type: 'provided'}
    ], (err, res) => {
      expect(res.get('test')).to.equal(123)
    })
  })

  it('should dynamically reload the config if option is set', done => {
    const fs = require('fs')

    fs.writeFileSync('./testFile', 'testKey=testValue')

    dvar.configure([
      {type: 'file', format: 'property', path: './testFile'}
    ], {
      dynamic: {
        interval: 10
      }
    }, (err, res) => {
      expect(res.get('testKey')).to.equal('testValue')
      expect(res.all().testKey).to.equal('testValue')

      fs.writeFileSync('./testFile', 'testKey=dynamicallyChangedtestValue')

      setTimeout(() => {
        expect(res.get('testKey')).to.equal('dynamicallyChangedtestValue')
        expect(res.all().testKey).to.equal('dynamicallyChangedtestValue')
        fs.unlinkSync('./testFile')
        done()
      }, 12)
    })
  })

  it('should fire loaded event when config successfully loaded', done => {
    dvar.once('loaded', values => {
      expect(values.test).to.equal(123)
      done()
    })
    dvar.configure([{type: 'provided', variables: {test: 123}}], (err, res) => {})
  })

  it('should fire update event when config dynamically update', done => {
    const fs = require('fs')

    fs.writeFileSync('./testFile', 'testKey=testValue')

    dvar.once('updated', values => {
      expect(values.testKey).to.equal('dynamicallyChangedtestValue')
      fs.unlinkSync('./testFile')
      done()
    })

    dvar.configure([
      {type: 'file', format: 'property', path: './testFile'}
    ], {
      dynamic: {
        interval: 10
      }
    }, (err, res) => {
      fs.writeFileSync('./testFile', 'testKey=dynamicallyChangedtestValue')
    })
  })

  it('should fire error event when error occurs', done => {
    dvar.once('error', values => {
      done()
    })
    dvar.configure([{type: 'file', path: 'does-not-exist'}], (err, res) => {})
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
