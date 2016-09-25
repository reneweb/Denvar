module.exports.resolve = (config, options) => {
  if (Array.isArray(config)) {
    return config
  } else if (options.env === undefined && process.env.NODE_ENV === undefined) {
    return config[Object.keys(config)[0]]
  } else if (options.env !== undefined) {
    return typeof options.env === 'function' ? config[options.env()] : config[options.env]
  } else if (process.env.NODE_ENV !== undefined) {
    return config[process.env.NODE_ENV]
  }
}
