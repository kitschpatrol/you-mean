import { expect, it } from 'vitest'
import { suggestify } from '../src/index'

// Run explicitly with pnpm test:integration; these checks depend on Google's live service.
it('gets text from the live Google suggestions endpoint', { timeout: 60_000 }, async () => {
	const result = await suggestify('success hides problems')

	expect(result.trim().length).toBeGreaterThan(0)
	expect(result).not.toContain('\n')
})

it('preserves lines with live Google suggestions', { timeout: 60_000 }, async () => {
	const result = await suggestify('\nwhat hath god wrought\nso do you like stuff\n')
	const lines = result.split('\n')

	expect(lines).toHaveLength(4)
	expect(lines[0]).toBe('')
	expect(lines[1]?.trim().length).toBeGreaterThan(0)
	expect(lines[2]?.trim().length).toBeGreaterThan(0)
	expect(lines[3]).toBe('')
})
