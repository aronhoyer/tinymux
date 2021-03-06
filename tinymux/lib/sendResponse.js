function sendResponse(response, responseWriter) {
  responseWriter.setHeader('Content-Type', 'application/json');

  if (response.headers) {
    for (const key in response.headers) {
      if (response.headers.hasOwnProperty(key)) {
        const value = response.headers[key];
        responseWriter.setHeader(key, value);
      }
    }
  }

  Object.assign(responseWriter, { statusCode: response.statusCode || 200 });
  responseWriter.end(JSON.stringify(response.body));
}

module.exports = sendResponse;
