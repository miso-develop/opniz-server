"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerCreator = void 0;
const WebSocketServer_1 = require("./servers/WebSocketServer");
const HttpServer_1 = require("./servers/HttpServer");
class ServerCreator {
    static create(port, protocol = ServerCreator.Protocol.ws) {
        switch (protocol) {
            default:
                return new WebSocketServer_1.WebSocketServer(port);
            case ServerCreator.Protocol.ws:
                return new WebSocketServer_1.WebSocketServer(port);
            case ServerCreator.Protocol.http:
                return new HttpServer_1.HttpServer(port);
        }
    }
}
exports.ServerCreator = ServerCreator;
(function (ServerCreator) {
    ServerCreator.Protocol = {
        ws: "ws",
        // wss: "wss",
        http: "http",
        // https: "https",
    };
})(ServerCreator = exports.ServerCreator || (exports.ServerCreator = {}));
