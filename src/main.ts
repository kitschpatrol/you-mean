// eslint-disable-next-line @typescript-eslint/naming-convention
import _ from 'lodash'
import memoize from 'memoizee'

// Caching async functions is tricky... this memoization library seems to work
const getSuggestion = memoize(async (phrase: string): Promise<string> => {
	// Clean up input
	phrase = _.trim(phrase)

	// Handle empty strings... (preserve line breaks)
	if (phrase.length === 0) return phrase

	// Old "API" URL was: https://google.com/complete/search?output=toolbar&q=microsoft
	// New "API" is https://suggestqueries.google.com/complete/search?output=firefox&q=your+text+here
	// Following documentation here: https://importsem.com/query-google-suggestions-api-with-python/

	// adding a trailing space prevents exact matches
	const url = new URL(
		'https://suggestqueries.google.com/complete/search?output=firefox&q=' + phrase + '%20',
	)

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	const response = await fetch(url.href)
	if (response.ok) {
		const suggestions = (await response.json()) as string[][]
		const firstSuggestion = suggestions[1][0]

		// Special case for single words with no suggestions...
		if (firstSuggestion === undefined && _.words(phrase).length === 1) {
			// Console.log("Giving up on: " + phrase);
			return phrase
		}

		// If (firstSuggestion !== undefined) {
		//   console.log("Found suggestion for: " + phrase);
		// }

		// Returns undefined if no suggestions are found
		return firstSuggestion
	}

	throw new Error(`Bad response for ${url.href} (${response.status}): ${response.statusText}`)
})

async function suggestifyPhrase(phrase: string): Promise<string> {
	// Strips punctuation
	const words = _.words(phrase)
	const leftoverWords = []

	let suggestion = await getSuggestion(words.join(' '))

	while (suggestion === undefined) {
		// Try to suggest based on as much of the original line as possible, then
		// walk left to try for matches on increasingly atomic fragments
		// Save the leftover words for their own suggestification
		leftoverWords.unshift(words.pop())
		suggestion = await getSuggestion(words.join(' '))
	}

	if (leftoverWords.length > 0) {
		return [suggestion, await suggestifyPhrase(leftoverWords.join(' '))].join(' ')
	}

	return suggestion
}

async function suggestifyLine(line: string, maxWordsPerPhrase = 8): Promise<string> {
	// Google chokes on giant lines... split them up into chunks
	const words = _.words(line)
	const phraseChunks = _.chunk(words, maxWordsPerPhrase)

	// Map doesn't work here? Can't nest Promise.all?
	// Hmm https://patmigliaccio.com/resolving-nested-promises/
	const phraseReconstituted = []
	for (const phraseChunk of phraseChunks) {
		const suggestifiedPhrase = await suggestifyPhrase(phraseChunk.join(' '))
		phraseReconstituted.push(suggestifiedPhrase)
	}

	return phraseReconstituted.join(' ')
}

export async function suggestify(sourceText: string): Promise<string> {
	const cleanText = _.deburr(sourceText)
	const lines = _.split(cleanText, /\r\n|\r|\n/)
	const meantLines = await Promise.all(lines.map(async (line) => suggestifyLine(line)))
	const youMeant = meantLines.join('\n')
	return youMeant
}
