"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const http_1 = require("http");
const WebSocketServer_1 = require("./WebSocketServer");
class HttpServer extends WebSocketServer_1.WebSocketServer {
    constructor(port) {
        super(port, http_1.createServer());
    }
}
exports.HttpServer = HttpServer;
