# tinymux

A super small package to create REST APIs.

## Installation

```sh
npm i tinymux
```

## Usage

```js
const Server = require('tinymux')

// initialize server
const s = new Server({ port: 5000 })

// handle request
s.handle('/v1/users', (req) => {
  const { username } = req.body
  
  // do controller stuff...

  // send response
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 201,
    body: {
      payload: { username },
    },
  }
}, ['POST'])

s.start()
```
