var redis = require('redis')

module.exports.init = (config, cb) => {
  const redisClient = redis.createClient(config)

  const readF = cb => {
    redisClient.hgetall(config.key, cb)
  }

  cb(null, {read: readF})
}
