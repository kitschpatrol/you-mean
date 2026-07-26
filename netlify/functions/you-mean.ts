import { suggestify } from '../../src/main'

const responseHeaders = {
	'access-control-allow-origin': '*',
	'content-type': 'application/json; charset=utf-8',
}

/**
 * Netlify Functions entry point, mirroring the Cloudflare worker in
 * `src/worker.ts`.
 */
export default async function handler(request: Request): Promise<Response> {
	const url = new URL(request.url)

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
}

export const config = {
	path: '/api/you-mean',
}
