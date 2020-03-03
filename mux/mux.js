const http = require('http');

const { pathToRegexp } = require('path-to-regexp');

const sendResponse = require('./lib/sendResponse');
const handleRequests = require('./lib/handleRequests');

const handlers = [];

class Mux {
  constructor({
    port,
    host = 'localhost',
    logRequests = true,
  }) {
    this.port = port;
    this.host = host;
    this.logRequests = logRequests;
  }

  logger(req) {
    process.stdout.write(`\x1b[2m${new Date().toISOString()} ${req.method} ${req.url}\x1b[0m\n`);
  }

  handle(path, callback, methods) {
    methods.forEach((method) => {
      if (!http.METHODS.includes(method)) {
        throw new TypeError(`Invalid HTTP verb: ${method}`);
      }
    });

    handlers.push({ path, callback, methods });
  }

  notFoundHandler() {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 404,
      body: {
        error: http.STATUS_CODES[404],
      },
    };
  }

  methodNotAllowedHandler() {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 405,
      body: {
        error: http.STATUS_CODES[405],
      },
    };
  }

  start(callback) {
    http.createServer((req, res) => {
      const handler = handlers.find((h) => pathToRegexp(h.path).test(req.url));

      if (!handler) {
        const response = this.notFoundHandler();
        sendResponse(response, res);
        return;
      }

      if (!handler.methods.includes(req.method)) {
        const response = this.methodNotAllowedHandler();
        sendResponse(response, res);
        return;
      }

      if (this.logRequests) this.logger(req);
      handleRequests.call(this, handler, req, res);
    }).listen(this.port, () => {
      if (typeof callback === 'function') {
        callback(this.port, this.host);
      } else {
        process.stdout.write(`\x1b[36m> Server available at http://${this.host}:${this.port}\x1b[0m\n`);
      }
    });
  }
}

module.exports = Mux;
module.exports.methods = http.METHODS.reduce((methods, method) => ({
  ...methods,
  [method]: method,
}), {});
