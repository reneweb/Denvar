const main = require('./lib/main')
const resolver = require('./lib/resolver')
const async = require('./lib/async')

module.exports.configure = function(config, cb) {
  const resolveFuncs = Object.keys(config).map(c => {
    (cb) => resolver.resolve(config[c], cb)
  })

  async.asyncMerge(resolveFuncs, results => {
    const errors = result.filter(r => r.err !== undefined)

    if(errors.length > 0) {
      cb(errors[0])
    } else {
      main(results.map(r => r.res), cb)
    }
  })
}
