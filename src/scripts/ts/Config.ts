export class Config {

	/**
	 * Get the configured backend host with optional protocol.
	 * @param protocol
	 */
	public static getBackendHost(protocol?: HostProtocol): string {
		let host = import.meta.env.VITE_BACKEND_HOST;
		const port = import.meta.env.VITE_BACKEND_PORT;
		if (port) {
			host += ':' + port;
		}

		if (protocol) {
			host = protocol + (this.isBackendSecure() ? 's' : '') + '://' + host;
		}

		return host;
	}

	public static isBackendSecure(): boolean {
		switch(import.meta.env.VITE_BACKEND_SSL) {
			case "yes":
			case "1":
			case "true":
				return true;
			default:
				return false;
		}
	}


}

type HostProtocol = 'http' | 'ws';
