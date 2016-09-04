const async = require('./async')

module.exports = function(providers, cb) {

  function setup(values) {
    const currentValues = results.reduce(( pre, cur ) => Object.assign(pre, cur), {})

    cb(null,
      {
        get: key => currentValues[key],
        getDynamic: key => () => currentValues[key],
        all: currentValues
      }
    )
  }

  async.merge(providers.map(provider => (cb) => provider.read(cb)), results => {
    const errors = result.filter(r => r.err !== undefined)

    if(errors.length > 0) {
      cb(errors[0])
    } else {
      setup(results.map(r => r.res))
    }
  })
}
