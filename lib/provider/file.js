const fs = require('fs')

function readAsJson(data, cb) {
  try {
    const variables = JSON.parse(data)
    cb(null, variables)
  } catch (error) {
    cb(new Error(`Could not parse data ${data} to JSON.`))
  }
}

function readAsProperties(path, data, cb) {
  const dataArray = data.split('\n')

  if (dataArray.some(entry => entry === undefined || entry.split('=').length < 2)) {
    return cb(new Error(`File ${path} contains malformed entries.`))
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
  const path = config.path
  const format = config.json ? 'json' : 'property'

  const readF = cb => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        return cb(err)
      }

      if (format === 'json') {
        return readAsJson(data, cb)
      }

      return readAsProperties(path, data, cb)
    })
  }

  cb(null, {read: readF})
}
