#dvar-ext-consul

This is a consul extension for dvar.

###Install

`npm install dvar --save`

`npm install dvar-ext-consul --save`

###Usage
```javascript
const dvar = require('dvar')
const dvarConsul = require('dvar-ext-consul')

dvar.addExtension('consul', dvarConsul).configure([
  {
    type: 'consul',
    host: 'localhost',
    port: 9111,
    secure: false,
    keyPrefix: 'test'
  }
], (err, res) => {
  console.log(res.get('testKey')) //assuming there is a 'testKey' entry
})
```
