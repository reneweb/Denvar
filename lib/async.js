module.exports.merge = (functions, cb) => {
  const results = []
  var currFunctionIndex = 0

  if (functions.length === 0) {
    return cb([])
  }

  functions.forEach(f => {
    f((err, res) => {
      results.push({err, res})
      currFunctionIndex++

      if (currFunctionIndex === functions.length) {
        return cb(results)
      }
    })
  })
}
