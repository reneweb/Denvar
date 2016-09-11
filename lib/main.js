const async = require('./async')

module.exports = (providers, options, cb) => {
  function setup(values) {
    const currentValues = values.reduce((pre, cur) => Object.assign(pre, cur), {})

    const currentValuesWithReplacments = Object.keys(currentValues).reduce((pre, cur) => {
      const key = options.replaceKeys ? options.replaceKeys(cur) : cur
      const value = options.replaceValues ? options.replaceValues(currentValues[cur]) : currentValues[cur]

      pre[key] = value
      return pre
    }, {})

    cb(null,
      {
        get: key => currentValuesWithReplacments[key],
        all: currentValuesWithReplacments
      }
    )
  }

  async.merge(providers.map(provider => provider.read), results => {
    const errors = results.filter(r => r.err)

    if (errors.length > 0) {
      cb(errors[0].err)
    } else {
      setup(results.map(r => r.res))
    }
  })
}
