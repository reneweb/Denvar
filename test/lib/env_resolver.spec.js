/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const envResolver = require('../../lib/env_resolver')

describe('env_resolver', () => {
  it('should just use given config if no environment specific configuration', () => {
    const resolvedEnvConfig = envResolver.resolve([{type: 'provided', variables: {test: 123}}], {})
    expect(resolvedEnvConfig[0].type).to.equal('provided')
    expect(resolvedEnvConfig[0].variables.test).to.equal(123)
  })

  it('should return config of env for given env option', () => {
    const resolvedEnvConfig = envResolver.resolve({
      staging: [{type: 'provided', variables: {test: 123}}],
      other: []
    }, {
      env: 'staging'
    })
    expect(resolvedEnvConfig[0].type).to.equal('provided')
    expect(resolvedEnvConfig[0].variables.test).to.equal(123)
  })

  it('should return config of env for given env option provided as function', () => {
    const resolvedEnvConfig = envResolver.resolve({
      staging: [{type: 'provided', variables: {test: 123}}],
      other: []
    }, {
      env: () => 'staging'
    })
    expect(resolvedEnvConfig[0].type).to.equal('provided')
    expect(resolvedEnvConfig[0].variables.test).to.equal(123)
  })

  it('should return config of env for process.env.NODE_ENV if no option set', () => {
    process.env.NODE_ENV = 'staging'

    const resolvedEnvConfig = envResolver.resolve({
      staging: [{type: 'provided', variables: {test: 123}}],
      other: []
    }, {})
    expect(resolvedEnvConfig[0].type).to.equal('provided')
    expect(resolvedEnvConfig[0].variables.test).to.equal(123)
  })

  it('should return config of first key in object if no option and no process.env.NODE_EN is set', () => {
    const resolvedEnvConfig = envResolver.resolve({
      staging: [{type: 'provided', variables: {test: 123}}],
      other: []
    }, {})
    expect(resolvedEnvConfig[0].type).to.equal('provided')
    expect(resolvedEnvConfig[0].variables.test).to.equal(123)
  })

  it('should return undefined if config for non-existent env is requested', () => {
    const resolvedEnvConfig = envResolver.resolve({
      staging: [{type: 'provided', variables: {test: 123}}],
      other: []
    }, {
      env: 'does-not-exist'
    })

    expect(resolvedEnvConfig).to.be.undefined
  })
})
