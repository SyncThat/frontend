/*------------------------------------------------------------------------*/
    /*  get API ASYNC function
    /*  getApi(headers, url);
/*------------------------------------------------------------------------*/
export default async function getApi(headers:HeadersInit, url:RequestInfo) {
    try {
        const response = await fetch(url, {
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
