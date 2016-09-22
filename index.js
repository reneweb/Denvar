const main = require('./lib/main')
const resolver = require('./lib/resolver')
const async = require('./lib/async')

var overrideConfig
var extensions = {}

function _configure(config, options, cb) {
  const resolveFuncs = Object.keys(config).map(c =>
    cb => resolver.resolve(config[c], extensions, cb)
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

module.exports.addExtension = (type, extension) => {
  extensions[type] = extension
  return this
}

module.exports.configure = (config, options, cb) => {
  if (cb === undefined) {
    cb = options === undefined ? () => {} : options
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
    cb = options === undefined ? () => {} : options
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

module.exports.on = (event, cb) => main.eventEmitter.on(event, cb)
module.exports.once = (event, cb) => main.eventEmitter.once(event, cb)
