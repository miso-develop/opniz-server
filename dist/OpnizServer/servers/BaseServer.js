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
exports.BaseServer = void 0;
const events_1 = require("events");
const MatchingMiddleware_1 = require("./middleware/MatchingMiddleware");
class BaseServer extends events_1.EventEmitter {
    constructor() {
        super();
        this.onconnection = (opnizId, socket) => { };
        this.onconnect = (opnizId, primary, secondary) => { };
        this.onrequest = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return payload; });
        this.onresponse = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return payload; });
        this._onconnection = (opnizId, socket) => { this.onconnection(opnizId, socket); };
        this._onconnect = (opnizId, primary, secondary) => { this.onconnect(opnizId, primary, secondary); };
        this._onrequest = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return yield this.onrequest(payload, src, dist); });
        this._onresponse = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return yield this.onresponse(payload, src, dist); });
        this._middleware = new MatchingMiddleware_1.MatchingMiddleware();
        this._middleware.onconnection = this._onconnection;
        this._middleware.onconnect = this._onconnect;
        this._middleware.onrequest = this._onrequest;
        this._middleware.onresponse = this._onresponse;
    }
}
exports.BaseServer = BaseServer;
