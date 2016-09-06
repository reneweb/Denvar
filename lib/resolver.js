const providers = {
  env: require('./provider/env'),
  file: require('./provider/file'),
  provided: require('./provider/provided')
}

module.exports.resolve = (config, cb) => {
  const providerType = config.type
  const provider = providers[providerType]
  if (provider === undefined) {
    cb(new Error(`Provider ${providerType} not found.`))
  } else {
    provider.init(config, cb)
  }
}
