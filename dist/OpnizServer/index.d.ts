import { Socket } from "socket.io";
import { IOpnizServer } from "./IOpnizServer";
import { ServerCreator } from "./ServerCreator";
export declare class OpnizServer implements IOpnizServer {
    private _server;
    onconnection: ((opnizId: string, socket: Socket) => void);
    onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void);
    onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>);
    onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>);
    private _onconnection;
    private _onconnect;
    private _onrequest;
    private _onresponse;
    constructor(port: number, protocol?: ServerCreator.Protocol);
    close(): void;
    disconnects(): void;
}
export declare namespace OpnizServer {
    const Protocol: {
        ws: string;
        http: string;
    };
    type Protocol = ServerCreator.Protocol;
}
