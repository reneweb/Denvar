#dvar    [![Build Status](https://travis-ci.org/reneweb/dvar.svg?branch=master)](https://travis-ci.org/reneweb/dvar)

dvar is a environment variable / property management library.
It currently supports the following to provide env variables:

- env (reading from process.env)
- file (reading from file)
- provided (provided in the code as Json)

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

When the same env variable is provided in different sources it will be overridden based on the array order (higher index will override lower).
```javascript
dvar.configure([
  {type: 'provided', variables: {override: 'firstString'}},
  {type: 'provided', variables: {override: 'secondString'}}
], (err, res) => {
  console.log(res.get('override')) //<- prints 'secondString'
})
```

#### Options
It is possible to provide a options object as the second parameter to the `config` function. If not provided defaults will be applied.
The currently supported options are:
- replaceKeys: Takes a function and will apply it for every key, replacing it with a new key. The key will be passed as a parameter to the function and the new key must be returned.
- replaceValues: Same as replaceKeys for values.

Example:

```
{
  replaceKeys: key => key.replace('-D', ''),
  replaceValues: values => String(value),
}
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
