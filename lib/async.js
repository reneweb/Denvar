module.exports.merge = (functions, cb) => {
  const results = []
  let currFunctionIndex = 0

  if (functions.length === 0) {
    return cb(null, [])
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
