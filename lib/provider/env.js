module.exports.init = function init(config, cb) {
  const readF = (cb) => cb(null, process.env)

  cb(null, {read: readF})
}
