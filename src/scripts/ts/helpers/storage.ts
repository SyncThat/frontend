
export function getFromStorage<T>(key: string): T|undefined {
	const item = window.localStorage.getItem(key);
	if (!item) {
		return undefined;
	}

	const parsed = JSON.parse(item);
	if (parsed === null) {
		return undefined;
	}

	return parsed;
}

export function setInStorage(key: string, data: any): void {
	window.localStorage.setItem(key, JSON.stringify(data));
}

export function removeFromStorage(key: string): void {
	window.localStorage.removeItem(key);
}
