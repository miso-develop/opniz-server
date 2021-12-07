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
exports.MatchingMiddleware = void 0;
const events_1 = require("events");
const utils_1 = require("../../../utils"); // DEBUG:
class MatchingMiddleware extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this._matchingTimeoutError = new Error("Matching timeout.");
        this._matchingTimeout = 10000 - 100; // MEMO: クライアントのデフォルトタイムアウトの10000msよりちょい早めに
        this._routeList = {};
        this.onconnection = (opnizId, socket) => __awaiter(this, void 0, void 0, function* () { });
        this.onconnect = (opnizId, primary, secondary) => __awaiter(this, void 0, void 0, function* () { });
        this.onrequest = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return payload; });
        this.onresponse = (payload, src, dist) => __awaiter(this, void 0, void 0, function* () { return payload; });
        this.matching = (socket, next) => __awaiter(this, void 0, void 0, function* () {
            yield this._middleware(socket, next);
        });
        this._middleware = (socket, next) => __awaiter(this, void 0, void 0, function* () {
            // log("socket.id", socket.id) // DEBUG:
            try {
                yield this._matching(socket);
                // log("[matching]") // DEBUG:
                next();
            }
            catch (e) {
                // log("[catch]", e.message) // DEBUG:
                next(e);
            }
        });
        this._showOpnizIdList = () => {
            const opnizIdList = [];
            for (const opnizId in this._routeList)
                opnizIdList.push(opnizId);
            utils_1.log(opnizIdList);
        };
    }
    _matching(socket) {
        const opnizId = this._getOpnizId(socket);
        this.onconnection(opnizId, socket);
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => _reject(this._matchingTimeoutError), this._matchingTimeout);
            const _resolve = () => {
                delete this._routeList[opnizId];
                socket.conn.removeListener("close", onclose);
                clearTimeout(timeoutId);
                resolve();
            };
            const _reject = (error) => {
                delete this._routeList[opnizId];
                this.removeAllListeners(`match:${opnizId}`);
                clearTimeout(timeoutId);
                reject(error);
            };
            const onclose = () => _reject(new Error("Client closed."));
            socket.conn.once("close", onclose);
            if (!this._routeList[opnizId])
                this._routeList[opnizId] = [];
            this._routeList[opnizId].push(socket);
            const routeSize = this._routeList[opnizId].length;
            if (routeSize === 1) {
                this.once(`match:${opnizId}`, _resolve);
            }
            else if (routeSize === 2) {
                this._routing(opnizId);
                this.emit(`match:${opnizId}`);
                _resolve();
            }
        });
    }
    _routing(opnizId) {
        const [primary, secondary] = this._routeList[opnizId];
        if (!primary || !secondary)
            return;
        this.onconnect(opnizId, primary, secondary);
        primary.on("request", (request, callback) => __awaiter(this, void 0, void 0, function* () {
            if (!secondary)
                return;
            const _request = yield this.onrequest(request, primary, secondary);
            const response = yield new Promise(resolve => secondary.emit("request", _request, resolve));
            const _response = yield this.onresponse(response, primary, secondary);
            callback(_response);
        }));
        secondary.on("request", (request, callback) => __awaiter(this, void 0, void 0, function* () {
            if (!secondary)
                return;
            const _request = yield this.onrequest(request, secondary, primary);
            const response = yield new Promise(resolve => primary.emit("request", _request, resolve));
            const _response = yield this.onresponse(response, secondary, primary);
            callback(_response);
        }));
        primary.once("disconnect", () => {
            // log("disconnect primary") // DEBUG:
            primary.removeAllListeners("request");
            secondary.disconnect(true);
        });
        secondary.once("disconnect", () => {
            // log("disconnect secondary") // DEBUG:
            secondary.removeAllListeners("request");
            primary.disconnect(true);
        });
    }
    _getQuery(socket) {
        return socket.handshake.query;
    }
    _getOpnizId(socket) {
        return String(this._getQuery(socket).opnizId || "___default___");
    }
}
exports.MatchingMiddleware = MatchingMiddleware;
