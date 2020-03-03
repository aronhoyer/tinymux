function sendResponse(response, responseWriter) {
  if (response.headers) {
    for (const key in response.headers) {
      if (response.headers.hasOwnProperty(key)) {
        const value = response.headers[key];
        responseWriter.setHeader(key, value)
      }
    }
  }
  responseWriter.statusCode = response.statusCode
  responseWriter.end(JSON.stringify(response.body))
}

module.exports = sendResponse
