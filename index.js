const main = require('./lib/main')
const resolver = require('./lib/resolver')
const async = require('./lib/async')

function _configure(config, options, cb) {
  const resolveFuncs = Object.keys(config).map(c =>
    cb => resolver.resolve(config[c], cb)
  )

  async.merge(resolveFuncs, results => {
    const errors = results.filter(r => r.err)

    if (errors.length > 0) {
      cb(errors[0].err)
    } else {
      main(results.map(r => r.res), options, cb)
    }
  })
}

var overrideConfig

module.exports.configure = (config, options, cb) => {
  if (cb === undefined) {
    cb = options
    options = {}
  }

  if (overrideConfig) {
    cb(null, overrideConfig)
  } else {
    _configure(config, options, cb)
  }
}

module.exports.override = (config, options, cb) => {
  if (cb === undefined) {
    cb = options
    options = {}
  }

  _configure(config, options, (err, res) => {
    if (err) return cb(err)

    overrideConfig = res
    cb(err, res)
  })
}

module.exports.removeOverride = () => {
  overrideConfig = undefined
}
