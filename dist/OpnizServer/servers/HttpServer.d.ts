import { IOpnizServer } from "../IOpnizServer";
import { WebSocketServer } from "./WebSocketServer";
export declare class HttpServer extends WebSocketServer implements IOpnizServer {
    constructor(port: number);
}
