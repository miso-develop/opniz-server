import { io, Socket } from "socket.io-client"

export const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms))

export class ClientMock {
	public socket: Socket
	public timeout = 100
	
	public connect = (port: number, routeId = "___default___") => {
		const uri = `ws://127.0.0.1:${port}`
		this.socket = io(uri, { query: { routeId } })
		this.socket.on("request", this.onrequest)
	}
	
	public onrequest = (message: string, callback) => callback("response: " + message)
	
	public request = async (message: string): Promise<string> => {
		await sleep(100)
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => reject(new Error("ClientMock request timeout.")), this.timeout)
			this.socket.emit("request", message, response => {
				clearTimeout(timeoutId)
				resolve(response)
			})
		})
	}
	
	public disconnect = () => this.socket.disconnect()
	
	public isConnected = () => this.socket.connected
	
	public setTimeout = timeout => this.timeout = timeout
}
