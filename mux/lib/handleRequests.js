const sendResponse = require('./sendResponse')
const getUrlVars = require('./getUrlVars')

function handleRequests(handler, req, res) {
  const vars = getUrlVars(handler.path, req.url)
  Object.assign(req, { vars })

  let body = {}

  req.on('data', (c) => {
    if (req.headers["content-type"] === 'application/json') {
      body = JSON.parse(c.toString())
    }
  })
  
  req.on('end', () => {
    Object.assign(req, { body })
    const response = handler.callback(req)
    sendResponse(response, res)
  })
}

module.exports = handleRequests
