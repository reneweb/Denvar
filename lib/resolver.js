const providers = {
  "env": require('provider/env'),
  "file": require('provider/file')
}

module.exports.resolve = function(config, cb) {
  const providerType = config.type
  const provider = providers[providerType]
  if(provider !== undefined) {
    provider.init(config, cb)
  } else {
    cb(new Error(`Provider ${providerType} not found.`))
  }
}
