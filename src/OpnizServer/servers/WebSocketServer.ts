import { Server } from "socket.io"
import { IOpnizServer } from "../IOpnizServer"
import { BaseServer } from "./BaseServer"

export class WebSocketServer extends BaseServer implements IOpnizServer {
	private _connectTimeout = 10000
	private _pingTimeout = 5000
	private _pingInterval = 10000
	
	private _wsServer: Server
	protected _server
	
	constructor(port: number, server?) {
		super()
		this._listen(port, server)
	}
	
	private _listen(port: number, server?): void {
		this._wsServer = new Server(server, {
			cors: { origin: "*" },
			connectTimeout: this._connectTimeout,
			pingTimeout: this._pingTimeout,
			pingInterval: this._pingInterval,
		})
		
		this._wsServer.use(this._middleware.matching)
		
		this._server = server ? server : this._wsServer
		
		this._server.listen(port)
	}
	
	public close() {
		this._server.close()
	}
	
	public disconnects() {
		this._wsServer.disconnectSockets(true)
	}
}
