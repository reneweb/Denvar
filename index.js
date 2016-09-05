const main = require('./lib/main')
const resolver = require('./lib/resolver')
const async = require('./lib/async')

module.exports.configure = function(config, cb) {
  const resolveFuncs = Object.keys(config).map(c =>
    (cb) => resolver.resolve(config[c], cb)
  )

  async.merge(resolveFuncs, results => {
    const errors = results.filter(r => r.err)

    if(errors.length > 0) {
      cb(errors[0].err)
    } else {
      main(results.map(r => r.res), cb)
    }
  })
}
