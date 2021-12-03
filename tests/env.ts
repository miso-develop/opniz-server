import ip from "ip"
import getPort from "get-port"

export { getPort }

export const env = {
	address: ip.address(),
	notExistAddress: "192.168.254.254",
}
