import { suggestify } from './main'

const responseHeaders = {
	'access-control-allow-origin': '*',
	'content-type': 'application/json; charset=utf-8',
}

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url)

		if (url.pathname !== '/api/you-mean') {
			// The route pattern needs a trailing wildcard to match query strings,
			// so stray paths under /api/you-mean land here too — hand them to
			// the origin site for a proper 404 instead of answering from the worker
			return fetch(request)
		}

		const response: Record<string, unknown> = {}
		const text = url.searchParams.get('text')

		// Validate query
		if (text === null || text.length === 0) {
			response.status = 'error'
			response.reason = 'You need to pass a URL-encoded "text" query parameter'
		} else {
			// Suggestify
			try {
				const youMeant = await suggestify(text)
				response.status = 'success'
				response.youSaid = text
				response.youMeant = youMeant
			} catch (error) {
				response.status = 'error'
				response.reason = error instanceof Error ? error.message : 'Unknown error'
			}
		}

		return Response.json(response, {
			headers: responseHeaders,
			status: 200,
		})
	},
}
