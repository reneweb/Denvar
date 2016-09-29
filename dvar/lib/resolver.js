const providers = {
  env: require('./provider/env'),
  file: require('./provider/file'),
  provided: require('./provider/provided'),
  http: require('./provider/http')
}

function getProvider(type, providers, extensions) {
  const extension = extensions[type]
  if (extension === undefined) {
    return providers[type]
  }

  return extensions[type]
}

module.exports.resolve = (config, extensions, cb) => {
  const providerType = config.type
  const provider = getProvider(providerType, providers, extensions)

  if (provider === undefined) {
    cb(new Error(`Provider ${providerType} not found.`))
  } else {
    provider.init(config, cb)
  }
}
