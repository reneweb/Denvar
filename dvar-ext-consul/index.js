const consulClient = require('consul')

module.exports.init = (config, cb) => {
  const host = config.host
  const port = config.port
  const secure = config.secure
  const keyPrefix = config.keyPrefix

  const consul = consulClient({
    host: host,
    port: port,
    secure: secure,
    keyPrefix: keyPrefix
  })

  const readF = cb => {
    consul.kv.get({
      key: keyPrefix,
      recurse: true
    }, (err, data, res) => {
      if (err) return cb(err)

      const transformedData = data.reduce((prev, curr) => {
        prev[curr.Key] = curr.Value
        return prev
      }, {})

      cb(err, transformedData)
    })
  }

  cb(null, {read: readF})
}
