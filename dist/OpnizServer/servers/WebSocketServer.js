"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const BaseServer_1 = require("./BaseServer");
class WebSocketServer extends BaseServer_1.BaseServer {
    constructor(port, server) {
        super();
        this._connectTimeout = 10000;
        this._pingTimeout = 5000;
        this._pingInterval = 10000;
        this._listen(port, server);
    }
    _listen(port, server) {
        this._wsServer = new socket_io_1.Server(server, {
            cors: { origin: "*" },
            connectTimeout: this._connectTimeout,
            pingTimeout: this._pingTimeout,
            pingInterval: this._pingInterval,
        });
        this._wsServer.use(this._middleware.matching);
        this._server = server ? server : this._wsServer;
        this._server.listen(port);
    }
    close() {
        this._server.close();
    }
    disconnects() {
        this._wsServer.disconnectSockets(true);
    }
}
exports.WebSocketServer = WebSocketServer;
