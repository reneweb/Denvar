module.exports.merge = function(functions, cb) {
  var results = []
  var currFunctionIndex = 0

  if(functions.length === 0) {
    return cb(null, [])
  }

  functions.forEach(f => {
    f((err, res) => {
      results.push({err: err, res: res})
      currFunctionIndex++

      if(currFunctionIndex == functions.length) {
        cb(results)
      }
    })
  })
}
