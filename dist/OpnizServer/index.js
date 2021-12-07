"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpnizServer = void 0;
const ServerCreator_1 = require("./ServerCreator");
class OpnizServer {
    constructor(port, protocol = ServerCreator_1.ServerCreator.Protocol.ws) {
        this.onconnection = (opnizId, socket) => { };
        this.onconnect = (opnizId, primary, secondary) => { };
        this.onrequest = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return payload; });
        this.onresponse = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return payload; });
        this._onconnection = (opnizId, socket) => { this.onconnection(opnizId, socket); };
        this._onconnect = (opnizId, primary, secondary) => { this.onconnect(opnizId, primary, secondary); };
        this._onrequest = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return yield this.onrequest(payload, src, dist); });
        this._onresponse = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return yield this.onresponse(payload, src, dist); });
        this._server = ServerCreator_1.ServerCreator.create(port, protocol);
        this._server.onconnection = this._onconnection;
        this._server.onconnect = this._onconnect;
        this._server.onrequest = this._onrequest;
        this._server.onresponse = this._onresponse;
    }
    close() {
        this._server.close();
    }
    disconnects() {
        this._server.disconnects();
    }
}
exports.OpnizServer = OpnizServer;
(function (OpnizServer) {
    OpnizServer.Protocol = ServerCreator_1.ServerCreator.Protocol;
})(OpnizServer = exports.OpnizServer || (exports.OpnizServer = {}));
