const async = require('./async')

module.exports = (providers, cb) => {
  function setup(values) {
    const currentValues = values.reduce((pre, cur) => Object.assign(pre, cur), {})

    cb(null,
      {
        get: key => currentValues[key],
        all: currentValues
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
