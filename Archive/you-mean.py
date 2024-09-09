# type: ignore

import sys
import urllib
from xml.dom import minidom
import string

# set to true for more output
debug = 0

def strip_punctuation(s):
	return s.translate(string.maketrans("",""), string.punctuation)

# returns a list of google suggestions

# store them in a dictionary for basic caching... then when parsing the text
# fetch the suggestion from google only if we need to
suggestion_cache = dict();

def fetch_suggestions(query):
	if query in suggestion_cache:
		return suggestion_cache[query]

	# here's the suggestion "API"
	# google.com/complete/search?output=toolbar&q=microsoft
	# adding a trailing space prevents partial matches
	# how to handle multi-word? find the largest possible suggestions
	query_string = urllib.urlencode({"output" : "toolbar", "q" : query})

	# returns some xml
	suggestion_request = urllib.urlopen("http://www.google.com/complete/search?" + query_string)

	suggestions = list();

	# handle the odd xml glitch from google
	try:
		suggestion_xml = minidom.parse(suggestion_request)
		# let's extract the suggestions (throw them in a list)
		for suggestion in suggestion_xml.getElementsByTagName("suggestion"):
			suggestions.append(suggestion.attributes["data"].value)

		suggestion_cache[query] = suggestions;
	except:
		pass

	suggestion_request.close()

	return suggestions


# glues together a list of words into a sentence based on start and end indexes
def partial_sentence(word_list, start, end):
	if len(word_list) >= end:
		sentence = str()
		for i in range(start, end):
			sentence = sentence + word_list[i] + " "

		return sentence.strip()
	else:
		return "partial sentence length error"


# takes a line and recursively returns google's suggestion
def suggestify_line(line):
	output_text = ""
	words = line.lower().strip().split(" ")

	if len(words) > 1:

		end_index = len(words)
		start_index = 0
		suggested_line = ""
		remaining_words = len(words)

		# try to suggest based on as much of the original line as possible, then
		# walk left to try for matches on increasingly atomic fragments
		while remaining_words > 0:
			query = partial_sentence(words, start_index, end_index)
			suggestions = fetch_suggestions(query)

			if debug:print "trying: " + query

			if suggestions:
				if debug: print "suggestion: " + suggestions[0]
				output_text += suggestions[0] + " "

				remaining_words = len(words) - end_index
				start_index = end_index;
				end_index = len(words)

			else:
				# else try a shorter query length
				if debug: print "no suggestions"

				# if we're at the end, relent and return original word
				if (end_index - start_index) == 1:
					if debug: print "no suggestions, using: " + words[start_index]
					output_text += words[start_index] + " "
					remaining_words = len(words) - end_index
					start_index = end_index;
					end_index = len(words)
				else:
					end_index -= 1

	# handle single word lines
	elif len(words) == 1:
		if debug: print "trying: " + words[0]
		suggestions = fetch_suggestions(words[0])
		if suggestions:
			if debug: print "suggestion: " + suggestions[0]
			output_text += suggestions[0] + " ";
		else:
			if debug: print "defeat"
			# defeat, you get to use the word you wanted
			if debug: print words[0]
			output_text += words[0] + " ";

	output_text.strip()
	return output_text



# are we in interactive mode?

if len(sys.argv) <= 1:
	# Grab a file from standard input, dump it in a string.
	source_text = sys.stdin.readlines()
	#source_text = open("frost.txt").readlines()
	#source_text = "His house is in the village though"

	output_text = ""

	for line in source_text:
		output_text += suggestify_line(strip_punctuation(line))
		output_text += "\n"

	print output_text


elif sys.argv[1] == "interactive":
	while 1:
		resp = raw_input("You say: ")
		print "You mean: " + suggestify_line(strip_punctuation(resp)) + "\n"
		if resp == "exit":
			break

else:
	# use the argument as input instead, for web version
	source_text = sys.argv[1].split('\n')

	output_text = ""

	for line in source_text:
		output_text += suggestify_line(strip_punctuation(line))
		output_text += "\n"

	print output_text
