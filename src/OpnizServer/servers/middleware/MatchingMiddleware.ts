import { EventEmitter } from "events"
import { Socket } from "socket.io"

import { dayjs, chalk, log, sleep, getDateStr } from "../../../utils" // DEBUG:

export class MatchingMiddleware extends EventEmitter {
	private _matchingTimeoutError = new Error("Matching timeout.")
	private _matchingTimeout = 10000 - 100 // MEMO: クライアントのデフォルトタイムアウトの10000msよりちょい早めに
	
	private _routeList: MatchingMiddleware.RouteList = {}
	
	public onconnection: ((opnizId: string, socket: Socket) => void) = async (opnizId: string, socket: Socket): Promise<void> => {}
	public onconnect: ((opnizId: string, primary: Socket, secondary: Socket) => void) = async (opnizId: string, primary: Socket, secondary: Socket): Promise<void> => {}
	public onrequest: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return payload }
	public onresponse: ((payload: string, src: Socket, dist: Socket) => string | Promise<string>) = async (payload: string, src: Socket, dist: Socket): Promise<string> => { return payload }
	
	public matching = async (socket: Socket, next: (error?: Error) => void): Promise<void> => {
		await this._middleware(socket, next)
	}
	
	private _middleware = async (socket: Socket, next: (error?: Error) => void): Promise<void> => {
		// log("socket.id", socket.id) // DEBUG:
		
		try {
			await this._matching(socket)
			// log("[matching]") // DEBUG:
			next()
		} catch (e) {
			// log("[catch]", e.message) // DEBUG:
			next(e)
		}
	}
	
	private _matching(socket: Socket): Promise<void> {
		const opnizId = this._getOpnizId(socket)
		this.onconnection(opnizId, socket)
		
		return new Promise<void>((resolve, reject) => {
			const timeoutId = setTimeout(() => _reject(this._matchingTimeoutError), this._matchingTimeout)
			
			const _resolve = () => {
				delete this._routeList[opnizId]
				socket.conn.removeListener("close", onclose)
				clearTimeout(timeoutId)
				resolve()
			}
			const _reject = (error: Error) => {
				delete this._routeList[opnizId]
				this.removeAllListeners(`match:${opnizId}`)
				clearTimeout(timeoutId)
				reject(error)
			}
			
			
			
			const onclose = () => _reject(new Error("Client closed."))
			socket.conn.once("close", onclose)
			
			
			
			if (!this._routeList[opnizId]) this._routeList[opnizId] = []
			this._routeList[opnizId].push(socket)
			
			const routeSize = this._routeList[opnizId].length
			if (routeSize === 1) {
				this.once(`match:${opnizId}`, _resolve)
				
			} else if (routeSize === 2) {
				this._routing(opnizId)
				
				this.emit(`match:${opnizId}`)
				_resolve()
			}
		})
	}
	
	private _routing(opnizId: string): void {
		const [primary, secondary] = this._routeList[opnizId]
		if (!primary || !secondary) return
		
		this.onconnect(opnizId, primary, secondary)
		
		primary.on("request", async (request: string, callback) => {
			if (!secondary) return
			const _request = await this.onrequest(request, primary, secondary)
			const response = await new Promise<string>(resolve => secondary.emit("request", _request, resolve))
			const _response = await this.onresponse(response, primary, secondary)
			callback(_response)
		})
		secondary.on("request", async (request: string, callback) => {
			if (!secondary) return
			const _request = await this.onrequest(request, secondary, primary)
			const response = await new Promise<string>(resolve => primary.emit("request", _request, resolve))
			const _response = await this.onresponse(response, secondary, primary)
			callback(_response)
		})
		
		primary.once("disconnect", () => {
			// log("disconnect primary") // DEBUG:
			primary.removeAllListeners("request")
			secondary.disconnect(true)
		})
		secondary.once("disconnect", () => {
			// log("disconnect secondary") // DEBUG:
			secondary.removeAllListeners("request")
			primary.disconnect(true)
		})
	}
	
	private _getQuery(socket: Socket) {
		return socket.handshake.query
	}
	
	private _getOpnizId(socket: Socket): string {
		return String(this._getQuery(socket).opnizId || "___default___")
	}
	
	private _showOpnizIdList = () => { // DEBUG:
		const opnizIdList: string[] = []
		for (const opnizId in this._routeList) opnizIdList.push(opnizId)
		log(opnizIdList)
	}
}

export namespace MatchingMiddleware {
	export type Route = [Socket?, Socket?]
	export type RouteList = { [key: string]: Route }
}
