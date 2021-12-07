import { IOpnizServer } from "../IOpnizServer";
import { BaseServer } from "./BaseServer";
export declare class WebSocketServer extends BaseServer implements IOpnizServer {
    private _connectTimeout;
    private _pingTimeout;
    private _pingInterval;
    private _wsServer;
    protected _server: any;
    constructor(port: number, server?: any);
    private _listen;
    close(): void;
    disconnects(): void;
}
