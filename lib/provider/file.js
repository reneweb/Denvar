const fs = require('fs')

module.exports.init = function init(config, cb) {
  const path = config.path


  const readF = (cb) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if(err) {
        return cb(err)
      }

      const dataArray = data.split('\n')

      if(dataArray.some(entry => entry === undefined || entry.split('=').length < 2)) {
        return cb(new Error(`File ${path} contains malformed entries.`))
      }

      const variables = dataArray.reduce((obj, entry) => {
        const splitEntry = entry.split('=')
        obj[splitEntry[0]] = splitEntry[1]
        return obj
      }, {})

      cb(null, variables)
    })
  }

  cb(null, {read: readF})
}
