/*------------------------------------------------------------------------*/
    /*  post API ASYNC function
    /*  postApi(headers, url);
/*------------------------------------------------------------------------*/
export default async function postApi(headers:HeadersInit, url:RequestInfo) {
    try {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit,
            headers
        });

		if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}
