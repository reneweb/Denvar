const providers = {
  "env": require('provider/env'),
  "file": require('provider/file')
}

module.exports.resolve = function(config) {
  const providerType = config.type
  const provider = providers[providerType]
  return provider.init(config)
}
