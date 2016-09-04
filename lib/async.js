module.exports.asyncMerge = function(functions, cb) {
  var results = []
  var currFunctionIndex = 0

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
