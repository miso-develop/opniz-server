import { IOpnizServer } from "./IOpnizServer"
import { WebSocketServer } from "./servers/WebSocketServer"
import { HttpServer } from "./servers/HttpServer"

export class ServerCreator {
	public static create(port: number, protocol: ServerCreator.Protocol = ServerCreator.Protocol.ws): IOpnizServer {
		switch (protocol) {
			default:
				return new WebSocketServer(port)
			case ServerCreator.Protocol.ws:
				return new WebSocketServer(port)
			case ServerCreator.Protocol.http:
				return new HttpServer(port)
		}
	}
}

export namespace ServerCreator {
	export const Protocol = {
		ws: "ws",
		// wss: "wss",
		http: "http",
		// https: "https",
	}
	export type Protocol = typeof Protocol[keyof typeof Protocol]
}
