#dvar    [![Build Status](https://travis-ci.org/reneweb/dvar.svg?branch=master)](https://travis-ci.org/reneweb/dvar)

dvar is a environment variable / property management library.
It currently supports the following to provide proeprties:
- env (reading from process.env)
- file (reading from file)
- provided (provided in the code)

###Install

`npm install dvar --save`

###Usage

####Quick start
```javascript
const dvar = require('dvar')
dvar.configure([
    {type: 'provided', variables: {test: 123}}
  ], (err, res) => {
    console.log(res.get('test')) //<- prints 123
    console.log(res.all['test']) //<- prints 123
})
```

####Multiple config's

dvar takes an array of config's which makes it possible to provide env vars from multiple sources.
```javascript
process.env.testEnv = 456

dvar.configure([
  {type: 'provided', variables: {test: 123}},
  {type: 'env'},
  {type: 'provided', variables: {anotherOne: 'someString'}}
], (err, res) => {
  console.log(res.get('test')) //<- prints 123
  console.log(res.get('testEnv')) //<- prints 456
  console.log(res.get('anotherOne')) //<- prints 'someString'
})
```

When the same env var is provided in different sources it will be overridden based on the array order (higher index will override lower).
```javascript
dvar.configure([
  {type: 'provided', variables: {override: 'firstString'}},
  {type: 'provided', variables: {override: 'secondString'}}
], (err, res) => {
  console.log(res.get('override')) //<- prints 'secondString'
})
```

#### Types

#####Provided
```javascript
dvar.configure([
  {type: 'provided', variables: {test: 123}}
], (err, res) => {
  console.log(res.get('test')) //<- prints 123
})
```

#####File
Currently there are two formats supported:
- json
- property (`key=value` separated by new line)

```javascript
fs.writeFileSync('./app.env', `testKey=testValue`)

dvar.configure([
  {type: 'file', format: 'property', path: './app.env'}
], (err, res) => {
  console.log(res.get('testKey')) //<- prints 'testValue'
})
```

#####Env
```javascript
process.env.testEnv = 456

dvar.configure([
  {type: 'env'}
], (err, res) => {
  console.log(res.get('testEnv')) //<- prints 456
})
```
