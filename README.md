#Denvar

Denvar is a environment variable / property management library.
It currently supports the following to provide proeprties:
- env (reading from process.env)
- file (reading files in the format of `key=value`)
- provided (provided in the code)

###Install

```npm install denvar --save```

###Usage

####Quick start
```
const denvar = require('denvar')
denvar.configure([
    {type: 'provided', variables: {test: 123}}
  ], (err, res) => {
    console.log(res.get('test')) //<- prints 123
})
```

####Multiple config's

Denvar takes an array of config's so it is possible to provide env vars from multiple sources.
```
process.env.testEnv = 456

denvar.configure([
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
```
denvar.configure([
  {type: 'provided', variables: {override: 'firstString'}},
  {type: 'provided', variables: {override: 'secondString'}}
], (err, res) => {
  console.log(res.get('override')) //<- prints 'secondString'
})
```

#### Types
#####Provided
```
denvar.configure([
  {type: 'provided', variables: {test: 123}}
], (err, res) => {
  console.log(res.get('test')) //<- prints 123
})
```

#####File
```
fs.writeFileSync('./app.env', `testKey=testValue`)

denvar.configure([
  {type: 'file', path: './app.env'}
], (err, res) => {
  console.log(res.get('testKey')) //<- prints 'testValue'
})
```

#####Env
```
process.env.testEnv = 456

denvar.configure([
  {type: 'env'}
], (err, res) => {
  console.log(res.get('testEnv')) //<- prints 456
})
```
