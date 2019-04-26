import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response

export function returnNullOn404<T>(response: Response<T>) {
	if (response.status === 404) {
		return null
	} else {
		throw response
	}
}
