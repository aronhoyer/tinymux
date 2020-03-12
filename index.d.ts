// Type definitions for tinymux
// Project: tinymux
// Definitions by: Aron Høyer <https://aronhoyer.com>

/// <reference types="node" />

import http from 'http';

export as namespace tinymux;

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = Server;

/*~ Write your module's methods and properties in this class */
declare class Server {
  constructor(config: Server.ServerConfig);

  protected readonly logger(req: Server.Request): void;

  readonly registerMiddleware(path: string, callback: (req: Server.Request) => Server.Response): void;

  readonly handle(path: string, callback: (req: Server.Request) => Server.Response, methods: string[]): void;

  notFoundHandler(): Server.Response;

  methodNotAllowedHandler(): Server.Response;

  readonly start(callback?: (port?: number, host?: number) => void): void;
}

declare namespace Server {
  export interface ServerConfig {
    port: number;
    host?: string;
    logRequests?: boolean;
  }

  export interface Request extends http.IncomingMessage {
    vars?: any;
    body?: any;
  }

  export interface Response {
    headers?: { [key: string]: string },
    statusCode?: number;
    body?: any;
  }
}
