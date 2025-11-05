import type { Handler } from '@netlify/functions'
import { suggestify } from '../../src/main'

const handler: Handler = async (event) => {
	const response: Record<string, unknown> = {}

	const { text } = event.queryStringParameters ?? {}

	// Validate query
	if (text === undefined || text.length === 0) {
		response.status = 'error'
		response.reason = 'You need to pass a URL-encoded "text" query parameter'
	} else {
		// Suggestify
		try {
			const sourceText = text
			const youMeant = await suggestify(sourceText)
			response.status = 'success'
			response.youSaid = sourceText
			response.youMeant = youMeant
		} catch (error) {
			response.status = 'error'
			response.reason = error instanceof Error ? error.message : 'Unknown error'
		}
	}

	return {
		body: JSON.stringify(response),
		headers: {
			'access-control-allow-origin': 'https://frontiernerds.com',
			'Content-Type': 'application/json; charset=utf-8',
			// "access-control-allow-origin": "*",
		},
		statusCode: 200,
	}
}

export { handler }
