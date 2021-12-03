import { createServer, Server } from "http"
import { IOpnizServer } from "../IOpnizServer"
import { WebSocketServer } from "./WebSocketServer"

export class HttpServer extends WebSocketServer implements IOpnizServer {
	constructor(port: number) {
		super(port, createServer())
	}
}
