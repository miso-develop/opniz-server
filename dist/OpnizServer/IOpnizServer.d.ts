import { Socket } from "socket.io";
export interface IOpnizServer {
    onconnection: (opnizId: string, socket: Socket) => void;
    onconnect: (opnizId: string, primary: Socket, secondary: Socket) => void;
    onrequest: (payload: string, src: Socket, dist: Socket) => string | Promise<string>;
    onresponse: (payload: string, src: Socket, dist: Socket) => string | Promise<string>;
    close(): void;
    disconnects(): void;
}
