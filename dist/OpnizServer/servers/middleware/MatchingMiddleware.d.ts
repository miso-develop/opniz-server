/// <reference types="node" />
import { EventEmitter } from "events";
import { Socket } from "socket.io";
export declare class MatchingMiddleware extends EventEmitter {
    private _matchingTimeoutError;
    private _matchingTimeout;
    private _routeList;
    onconnection: ((opnizId: string, socket: Socket) => void);
    onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void);
    onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>);
    onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>);
    matching: (socket: Socket, next: (error?: Error | undefined) => void) => Promise<void>;
    private _middleware;
    private _matching;
    private _routing;
    private _getQuery;
    private _getOpnizId;
    private _showOpnizIdList;
}
export declare namespace MatchingMiddleware {
    type Route = [Socket?, Socket?];
    type RouteList = {
        [key: string]: Route;
    };
}
