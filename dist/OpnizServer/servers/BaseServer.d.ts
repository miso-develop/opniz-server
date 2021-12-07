/// <reference types="node" />
import { EventEmitter } from "events";
import { Socket } from "socket.io";
import { IOpnizServer } from "../IOpnizServer";
import { MatchingMiddleware } from "./middleware/MatchingMiddleware";
export declare abstract class BaseServer extends EventEmitter implements IOpnizServer {
    protected _middleware: MatchingMiddleware;
    onconnection: ((opnizId: string, socket: Socket) => void);
    onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void);
    onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>);
    onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>);
    private _onconnection;
    private _onconnect;
    private _onrequest;
    private _onresponse;
    constructor();
    abstract close(): any;
    abstract disconnects(): any;
}
