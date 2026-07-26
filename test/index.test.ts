import { expect, it } from 'vitest'
import { suggestify } from '../src/index'

it('gets the text you meant from a single line', { timeout: 60_000 }, async () => {
	const result = await suggestify(`success hides problems`)

	// These might not be stable over long durations...
	expect(result).toMatchInlineSnapshot(`"success hides problem"`)
})

it('gets the text you meant across multiple lines', { timeout: 60_000 }, async () => {
	const result = await suggestify(
		`
		what hath god wrought
		so do you like stuff
		`,
	)

	// These might not be stable over long durations...
	expect(result).toMatchInlineSnapshot(`
		"
		what hath god wrought meaning
		so do you like stuff gif
		"
	`)
})
