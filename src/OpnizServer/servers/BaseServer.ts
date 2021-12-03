import { EventEmitter } from "events"
import { Socket } from "socket.io"
import { IOpnizServer } from "../IOpnizServer"
import { MatchingMiddleware } from "./middleware/MatchingMiddleware"

export abstract class BaseServer extends EventEmitter implements IOpnizServer {
	protected _middleware: MatchingMiddleware
	
	public onconnection: ((opnizId: string, socket: Socket) => void) = (opnizId: string, socket: Socket): void => {}
	public onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void) = (opnizId: string, primary: Socket, secondary: Socket): void => {}
	public onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return payload }
	public onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return payload }
	
	private _onconnection: ((opnizId: string, socket: Socket) => void) = (opnizId: string, socket: Socket): void => { this.onconnection(opnizId, socket) }
	private _onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void) = (opnizId: string, primary: Socket, secondary: Socket): void => { this.onconnect(opnizId, primary, secondary) }
	private _onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return await this.onrequest(payload, src, dist) }
	private _onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return await this.onresponse(payload, src, dist) }
	
	constructor() {
		super()
		this._middleware = new MatchingMiddleware()
		this._middleware.onconnection = this._onconnection
		this._middleware.onconnect = this._onconnect
		this._middleware.onrequest = this._onrequest
		this._middleware.onresponse = this._onresponse
	}
	
	public abstract close()
	public abstract disconnects()
}
