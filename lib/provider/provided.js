module.exports.init = (config, cb) => {
  const vars = config.variables
  const readF = cb => cb(null, vars)

  cb(null, {read: readF})
}
