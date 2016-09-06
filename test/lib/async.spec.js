const assert = require('assert')
const async = require('../../lib/async')

const functions = [cb => cb(null, 1), cb => cb(null, 2), cb => cb(null, 3)]

async.merge(functions, results => {
  assert.equal(results[0].res, 1)
  assert.equal(results[1].res, 2)
  assert.equal(results[2].res, 3)
})
