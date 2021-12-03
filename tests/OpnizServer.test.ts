import "source-map-support/register"
import { OpnizServer } from "../src/index"
import { ClientMock } from "./ClientMock"

import { env, getPort } from "./env"
import { log, sleep, getDateStr } from "../src/utils"

jest.retryTimes(10)

describe("OpnizServer", () => {
// describe.skip("OpnizServer", () => {
	
	let server: OpnizServer
	let port: number
	
	let primaryClient: ClientMock = new ClientMock()
	let secondaryClient: ClientMock = new ClientMock()
	let id = "___test___"
	
	let primaryClient2: ClientMock = new ClientMock()
	let secondaryClient2: ClientMock = new ClientMock()
	let id2 = "___test2___"
	
	
	
	beforeAll(async () => {
		port = await getPort()
	})
	
	beforeEach(async () => {
		primaryClient.connect(port, id)
		secondaryClient.connect(port, id)
		primaryClient2.connect(port, id2)
		secondaryClient2.connect(port, id2)
	})
	
	
	
	describe("ws", () => {
		
		beforeEach(async () => {
			server = new OpnizServer(port)
		})
		
		describe("client request", () => {
			test("primaryClient.request", async () => {
				const actual = await primaryClient.request("test")
				expect(actual).toBe("response: test")
			})
			test("secondaryClient.request", async () => {
				const actual = await secondaryClient.request("test")
				expect(actual).toBe("response: test")
			})
			test("primaryClient2.request", async () => {
				const actual = await primaryClient2.request("test")
				expect(actual).toBe("response: test")
			})
			test("secondaryClient2.request", async () => {
				const actual = await secondaryClient2.request("test")
				expect(actual).toBe("response: test")
			})
		})
		
		describe("matching", () => {
			
			beforeEach(async () => {
				primaryClient.disconnect()
				secondaryClient.disconnect()
				primaryClient2.disconnect()
				secondaryClient2.disconnect()
				
				primaryClient.connect(port, id)
				primaryClient2.connect(port, id2)
			})
			
			test("client1、client2がマッチング待ちの状態からclient1のみマッチング", async () => {
				secondaryClient.connect(port, id)
				
				let actual
				actual = await primaryClient.request("test")
				expect(actual).toBe("response: test")
				
				try {
					await primaryClient2.request("test")
				} catch (e) {
					expect(e.message).toMatch("ClientMock request timeout.")
				}
			})
			test("client1、client2がマッチング待ちの状態からclient2のみマッチング", async () => {
				secondaryClient2.connect(port, id2)
				
				let actual
				actual = await primaryClient2.request("test")
				expect(actual).toBe("response: test")
				
				try {
					await primaryClient.request("test")
				} catch (e) {
					expect(e.message).toMatch("ClientMock request timeout.")
				}
			})
			test("client1、client2がマッチング待ちの状態から交互にマッチング", async () => {
				secondaryClient.connect(port, id)
				secondaryClient2.connect(port, id2)
				
				let actual
				actual = await primaryClient.request("test")
				expect(actual).toBe("response: test")
				actual = await secondaryClient.request("test")
				expect(actual).toBe("response: test")
				actual = await primaryClient2.request("test")
				expect(actual).toBe("response: test")
				actual = await secondaryClient2.request("test")
				expect(actual).toBe("response: test")
			})
		})
		
		describe("server close", () => {
			test("server close", async () => {
				const actual = server.close()
				expect(actual).toBeUndefined()
			})
		})
		
		describe("onmethods", () => {
			let onMethodMock: jest.Mock<any, any>
			
			describe("connect", () => {
				
				beforeEach(async () => {
					primaryClient.disconnect()
					secondaryClient.disconnect()
					primaryClient2.disconnect()
					secondaryClient2.disconnect()
				})
				
				test("onconnection", async () => {
					server.onconnection = onMethodMock = jest.fn()
					
					primaryClient.connect(port, id)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(1)
					
					secondaryClient.connect(port, id)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(2)
					
					primaryClient2.connect(port, id2)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(3)
					
					secondaryClient2.connect(port, id2)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(4)
					
				})
				test("onconnect", async () => {
					server.onconnect = onMethodMock = jest.fn()
					
					primaryClient.connect(port, id)
					secondaryClient.connect(port, id)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(1)
					
					primaryClient2.connect(port, id2)
					secondaryClient2.connect(port, id2)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(2)
				})
			})
			
			describe("request/response", () => {
				test("onrequest", async () => {
					server.onrequest = onMethodMock = jest.fn()
					
					await primaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(1)
					await secondaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(2)
				})
				test("onresponse", async () => {
					server.onresponse = onMethodMock = jest.fn()
					
					await primaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(1)
					await secondaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(2)
				})
			})
		})
	})
	
	
	
	describe("http", () => {
		
		beforeEach(async () => {
			server = new OpnizServer(port, OpnizServer.Protocol.http)
		})
		
		describe("client request", () => {
			test("primaryClient.request", async () => {
				const actual = await primaryClient.request("test")
				expect(actual).toBe("response: test")
			})
			test("secondaryClient.request", async () => {
				const actual = await secondaryClient.request("test")
				expect(actual).toBe("response: test")
			})
			test("primaryClient2.request", async () => {
				const actual = await primaryClient2.request("test")
				expect(actual).toBe("response: test")
			})
			test("secondaryClient2.request", async () => {
				const actual = await secondaryClient2.request("test")
				expect(actual).toBe("response: test")
			})
		})
		
		describe("matching", () => {
			
			beforeEach(async () => {
				primaryClient.disconnect()
				secondaryClient.disconnect()
				primaryClient2.disconnect()
				secondaryClient2.disconnect()
				
				primaryClient.connect(port, id)
				primaryClient2.connect(port, id2)
			})
			
			test("client1、client2がマッチング待ちの状態からclient1のみマッチング", async () => {
				secondaryClient.connect(port, id)
				
				let actual
				actual = await primaryClient.request("test")
				expect(actual).toBe("response: test")
				
				try {
					await primaryClient2.request("test")
				} catch (e) {
					expect(e.message).toMatch("ClientMock request timeout.")
				}
			})
			test("client1、client2がマッチング待ちの状態からclient2のみマッチング", async () => {
				secondaryClient2.connect(port, id2)
				
				let actual
				actual = await primaryClient2.request("test")
				expect(actual).toBe("response: test")
				
				try {
					await primaryClient.request("test")
				} catch (e) {
					expect(e.message).toMatch("ClientMock request timeout.")
				}
			})
			test("client1、client2がマッチング待ちの状態から交互にマッチング", async () => {
				secondaryClient.connect(port, id)
				secondaryClient2.connect(port, id2)
				
				let actual
				actual = await primaryClient.request("test")
				expect(actual).toBe("response: test")
				actual = await secondaryClient.request("test")
				expect(actual).toBe("response: test")
				actual = await primaryClient2.request("test")
				expect(actual).toBe("response: test")
				actual = await secondaryClient2.request("test")
				expect(actual).toBe("response: test")
			})
		})
		
		describe("server close", () => {
			test("server close", async () => {
				const actual = server.close()
				expect(actual).toBeUndefined()
			})
		})
		
		describe("onmethods", () => {
			let onMethodMock: jest.Mock<any, any>
			
			describe("connect", () => {
				
				beforeEach(async () => {
					primaryClient.disconnect()
					secondaryClient.disconnect()
					primaryClient2.disconnect()
					secondaryClient2.disconnect()
				})
				
				test("onconnection", async () => {
					server.onconnection = onMethodMock = jest.fn()
					
					primaryClient.connect(port, id)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(1)
					
					secondaryClient.connect(port, id)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(2)
					
					primaryClient2.connect(port, id2)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(3)
					
					secondaryClient2.connect(port, id2)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(4)
					
				})
				test("onconnect", async () => {
					server.onconnect = onMethodMock = jest.fn()
					
					primaryClient.connect(port, id)
					secondaryClient.connect(port, id)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(1)
					
					primaryClient2.connect(port, id2)
					secondaryClient2.connect(port, id2)
					await sleep(100)
					expect(onMethodMock).toBeCalledTimes(2)
				})
			})
			
			describe("request/response", () => {
				test("onrequest", async () => {
					server.onrequest = onMethodMock = jest.fn()
					
					await primaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(1)
					await secondaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(2)
				})
				test("onresponse", async () => {
					server.onresponse = onMethodMock = jest.fn()
					
					await primaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(1)
					await secondaryClient.request("test")
					expect(onMethodMock).toBeCalledTimes(2)
				})
			})
		})
	})
	
	
	
	afterEach(async () => {
		primaryClient.disconnect()
		secondaryClient.disconnect()
		primaryClient2.disconnect()
		secondaryClient2.disconnect()
		
		server.disconnects()
		server.close()
	})
	
	afterAll(async () => {
		
	})
	
})
