import { Socket } from "socket.io"
import { IOpnizServer } from "./IOpnizServer"
import { ServerCreator } from "./ServerCreator"

export class OpnizServer implements IOpnizServer {
	private _server: IOpnizServer
	
	public onconnection: ((opnizId: string, socket: Socket) => void) = (opnizId: string, socket: Socket): void => {}
	public onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void) = (opnizId: string, primary: Socket, secondary: Socket): void => {}
	public onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return payload }
	public onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return payload }
	
	private _onconnection: ((opnizId: string, socket: Socket) => void) = (opnizId: string, socket: Socket): void => { this.onconnection(opnizId, socket) }
	private _onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void) = (opnizId: string, primary: Socket, secondary: Socket): void => { this.onconnect(opnizId, primary, secondary) }
	private _onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return await this.onrequest(payload, src, dist) }
	private _onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return await this.onresponse(payload, src, dist) }
	
	constructor(port: number, protocol: ServerCreator.Protocol = ServerCreator.Protocol.ws) {
		this._server = ServerCreator.create(port, protocol)
		this._server.onconnection = this._onconnection
		this._server.onconnect = this._onconnect
		this._server.onrequest = this._onrequest
		this._server.onresponse = this._onresponse
	}
	
	public close(): void {
		this._server.close()
	}
	public disconnects(): void {
		this._server.disconnects()
	}
}

export namespace OpnizServer {
	export const Protocol = ServerCreator.Protocol
	export type Protocol = ServerCreator.Protocol
}
