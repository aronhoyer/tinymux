# tinymux

A super small package to create REST APIs.

## Installation

```sh
npm i tinymux
```

## Basic usage

```js
const Server = require('tinymux')

// initialize server
const s = new Server({ port: 5000 })

// handle request
s.handle('/v1/users', (req) => {
  // do controller stuff...

  // send response
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 201,
    body: {
      message: 'Hello, World!',
    },
  }
}, ['POST'])

s.start()
```

## Routing

Routes go through the [`path-to-regexp`](https://www.npmjs.com/package/path-to-regexp) package, so just use regular expressions for routing registration.

You can also register URL variables: `/users/:userId`.

## Middlewares

```js
s.registerMiddleware('(.*)', (req) => console.log(new Date().toISOString(), req.method, req.url))

s.registerMiddleware('(.*)', (req) => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
}), ['GET'])
```

## Handlers

### Built-in handlers

tinymux comes with two built-in handlers. These can be overwritten if you want them to do something else.

```js
s.notFoundHandler()
s.methodNotAllowedHandler()
```

### Async handlers

You can register an async handler by simply passing an async callback function.

Handlers don't, however, **need** to be async.

```js
s.handle('/users', async (req) => {
  const [bodyIsValid, reason] = validateRequestBody(req.body)

  try {
    if (!bodyIsValid) throw new Error(reason)

    const insertedUser = await db.insertUser(req.body)
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 201,
      body: insertedUser,
    }
  } catch(err) {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 500,
      body: {
        error: http.STATUS_CODES[500],
      },
    }
  }
}, ['POST'])

s.handle('/users/:id', async (req) => {
  const { id } = req.vars

  try {
    const user = await db.getUserById(id)
    if (!user) return s.notFoundHandler()

    return {
      statusCode: 200,
      body: {
        payload: user,
      },
    }
  }
}, ['GET'])
```
