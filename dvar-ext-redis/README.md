# dvar-ext-redis

This is a redis extension for dvar.
It returns the value at the given key as the config. Thus, it should be a hash.

### Install

`npm install dvar --save`

`npm install dvar-ext-redis --save`

### Usage
```javascript
const dvar = require('dvar')
const dvarRedis = require('dvar-ext-redis')

dvar.addExtension('redis', dvarRedis).configure([
  {
    type: 'redis',
    host: 'localhost',
    port: 9111,
    key: 'test'
  }
], (err, res) => {
  console.log(res.get('testKey')) //assuming there is a 'testKey' entry
})
```
