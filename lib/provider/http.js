const http = require('http')
const Url = require('url')

function readAsJson(data, cb) {
  try {
    const variables = JSON.parse(data)
    cb(null, variables)
  } catch (error) {
    cb(new Error(`Could not parse data ${data} to JSON.`))
  }
}

function readAsProperties(url, data, cb) {
  const dataArray = data.split('\n')

  if (dataArray.some(entry => entry === undefined || entry.split('=').length < 2)) {
    return cb(new Error(`Data at ${url} contains malformed entries.`))
  }

  const tryConvertNumber = value => {
    if (value.trim().length === 0 || isNaN(Number(value))) {
      return value
    }
    return Number(value)
  }

  const tryConvertBoolean = value => {
    if (value === 'true') return true
    else if (value === 'false') return false
    return value
  }

  const convert = value => tryConvertBoolean(tryConvertNumber(value))

  const variables = dataArray.reduce((obj, entry) => {
    const splitEntry = entry.split('=')
    obj[splitEntry[0]] = convert(splitEntry[1])
    return obj
  }, {})

  cb(null, variables)
}

module.exports.init = (config, cb) => {
  const url = Url.parse(config.url)
  const format = config.format === 'json' ? 'json' : 'property'

  const readF = cb => {
    var options = {
      hostname: url.hostname,
      port: url.port,
      path: url.path,
      method: 'GET'
    }

    var req = http.request(options, res => {
      var body = []
      res.setEncoding('utf8')
      res.on('data', chunk => {
        body.push(chunk)
      })

      res.on('end', () => {
        const data = Buffer.isBuffer(body) ? Buffer.concat(body).toString() : body.join()

        if (format === 'json') {
          return readAsJson(data, cb)
        }

        return readAsProperties(url, data, cb)
      })
    })

    req.on('error', err => {
      cb(err)
    })

    req.end()
  }

  cb(null, {read: readF})
}
