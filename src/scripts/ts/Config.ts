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

	public static getMediaHost(): string {
		const overwrite = import.meta.env.VITE_MEDIA_HOST;
		if (overwrite) {
			if (!/\/$/.test(overwrite)) {
				return overwrite;
			} else {
				return overwrite.replace(/\/$/, '');
			}
		}

		// Return default backend host route
		return this.getBackendHost('http') + '/songs/stream';
	}

	public static isBackendSecure(): boolean {
		const isSsl = import.meta.env.VITE_BACKEND_SSL;
		console.log('isSSL', isSsl);

		switch(isSsl) {
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
