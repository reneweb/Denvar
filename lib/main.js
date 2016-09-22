const async = require('./async')
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()

var values = {}

function readFromProviders(providers, options, cb) {
  const prepareValues = values => {
    const currentValues = values.reduce((pre, cur) => Object.assign(pre, cur), {})

    return Object.keys(currentValues).reduce((pre, cur) => {
      const key = options.replaceKeys ? options.replaceKeys(cur) : cur
      const value = options.replaceValues ? options.replaceValues(currentValues[cur]) : currentValues[cur]

      pre[key] = value
      return pre
    }, {})
  }

  async.merge(providers.map(provider => provider.read), results => {
    const errors = results.filter(r => r.err)

    if (errors.length > 0) {
      cb(errors[0].err)
    } else {
      values = prepareValues(results.map(r => r.res))
      cb()
    }
  })
}

module.exports = (providers, options, cb) => {
  readFromProviders(providers, options, err => {
    if (err) {
      eventEmitter.emit('error', err)
      return cb(err)
    }

    eventEmitter.emit('loaded', values)
    cb(null, {
      get: key => values[key],
      all: () => values
    })
  })

  if (options.dynamic) {
    const interval = options.dynamic.interval ? options.dynamic.interval : 1000 * 60
    setTimeout(() => {
      readFromProviders(providers, options, err => {
        if (err) return eventEmitter.emit('error', err)
        eventEmitter.emit('updated', values)
      })
    }, interval)
  }
}

module.exports.eventEmitter = eventEmitter
