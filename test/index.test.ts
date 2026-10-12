import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
	// Each test gets a fresh suggestion cache and cannot make live requests.
	vi.resetModules()
	fetchMock.mockReset()
	vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
	vi.unstubAllGlobals()
})

it('gets the text you meant from a single line', async () => {
	fetchMock.mockResolvedValueOnce(
		Response.json(['success hides problems ', ['success hides problems']]),
	)
	const { suggestify } = await import('../src/index')

	await expect(suggestify('success hides problems')).resolves.toBe('success hides problems')
	expect(fetchMock).toHaveBeenCalledTimes(1)
	expect(fetchMock.mock.calls[0]?.[0]).toBe(
		'https://suggestqueries.google.com/complete/search?client=firefox&q=success%20hides%20problems%20',
	)
})

it('gets the text you meant across multiple lines', async () => {
	fetchMock
		.mockResolvedValueOnce(
			Response.json(['what hath god wrought ', ['what hath god wrought meaning']]),
		)
		.mockResolvedValueOnce(Response.json(['so do you like stuff ', ['so do you like stuff gif']]))
	const { suggestify } = await import('../src/index')

	await expect(suggestify('\r\nwhat hath god wrought\rso do you like stuff\n')).resolves.toBe(
		'\nwhat hath god wrought meaning\nso do you like stuff gif\n',
	)
	expect(fetchMock).toHaveBeenCalledTimes(2)
})

it('tries shorter phrases and transforms the remaining words when no suggestion exists', async () => {
	fetchMock
		.mockResolvedValueOnce(Response.json(['hello world ', []]))
		.mockResolvedValueOnce(Response.json(['hello ', ['hello there']]))
		.mockResolvedValueOnce(Response.json(['world ', ['world peace']]))
	const { suggestify } = await import('../src/index')

	await expect(suggestify('hello world')).resolves.toBe('hello there world peace')
	expect(fetchMock).toHaveBeenCalledTimes(3)
})

it('preserves a single word with no suggestions', async () => {
	fetchMock.mockResolvedValueOnce(Response.json(['hello ', []]))
	const { suggestify } = await import('../src/index')

	await expect(suggestify('hello')).resolves.toBe('hello')
	expect(fetchMock).toHaveBeenCalledTimes(1)
})

it('preserves blank lines without making requests', async () => {
	const { suggestify } = await import('../src/index')

	await expect(suggestify('\n\n')).resolves.toBe('\n\n')
	expect(fetchMock).not.toHaveBeenCalled()
})

it('shares a request between repeated lines', async () => {
	fetchMock.mockResolvedValueOnce(Response.json(['hello ', ['hello there']]))
	const { suggestify } = await import('../src/index')

	await expect(suggestify('hello\nhello')).resolves.toBe('hello there\nhello there')
	expect(fetchMock).toHaveBeenCalledTimes(1)
})

it('includes the response body when Google rejects a request', async () => {
	fetchMock.mockResolvedValueOnce(
		new Response('Request rejected by upstream', { status: 400, statusText: 'Bad Request' }),
	)
	const { suggestify } = await import('../src/index')

	await expect(suggestify('hello')).rejects.toThrow(
		'Bad response for https://suggestqueries.google.com/complete/search?client=firefox&q=hello%20 (400): Bad Request\nRequest rejected by upstream',
	)
})

it('preserves the HTTP error when the response body cannot be read', async () => {
	const response = new Response('', { status: 400, statusText: 'Bad Request' })
	vi.spyOn(response, 'text').mockRejectedValueOnce(new Error('Connection closed'))
	fetchMock.mockResolvedValueOnce(response)
	const { suggestify } = await import('../src/index')

	await expect(suggestify('hello')).rejects.toThrow(
		'Bad response for https://suggestqueries.google.com/complete/search?client=firefox&q=hello%20 (400): Bad Request',
	)
})
