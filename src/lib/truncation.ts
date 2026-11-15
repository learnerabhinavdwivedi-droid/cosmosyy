/**
 * Sentence-boundary-aware truncation utilities.
 * Ensures that historical quotes, scientific facts, and narratives are never cut mid-word,
 * mid-quote, or mid-sentence.
 */

export function splitIntoSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const sentences: string[] = [];
  let current = "";
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]!;
    const prev = i > 0 ? trimmed[i - 1]! : "";
    const next = i < trimmed.length - 1 ? trimmed[i + 1]! : "";

    current += ch;

    // Track double quotes: straight " or typographic “ ”
    if (ch === '"' || ch === "“" || ch === "”") {
      inDoubleQuote = !inDoubleQuote;
    }
    // Track single quotes: ' or typographic ‘ ’ (excluding apostrophes like Earth's, haven't)
    else if (ch === "'" || ch === "‘" || ch === "’") {
      const isApostrophe = Boolean(prev && next && /\w/.test(prev) && /\w/.test(next));
      if (!isApostrophe) {
        inSingleQuote = !inSingleQuote;
      }
    }

    const isPunctuation = ch === "." || ch === "!" || ch === "?";
    const isQuoteClosingAfterPunct =
      !inDoubleQuote &&
      !inSingleQuote &&
      (ch === '"' || ch === "'" || ch === "”" || ch === "’") &&
      Boolean(prev && /[.!?]/.test(prev));

    if ((isPunctuation && !inDoubleQuote && !inSingleQuote) || isQuoteClosingAfterPunct) {
      // Consume any immediately following closing quotes, brackets, or parentheses
      let j = i + 1;
      while (j < trimmed.length && /['"’”\])]/.test(trimmed[j]!)) {
        current += trimmed[j]!;
        if (trimmed[j] === '"' || trimmed[j] === "”") inDoubleQuote = false;
        if (trimmed[j] === "'" || trimmed[j] === "’") inSingleQuote = false;
        j++;
        i = j - 1;
      }

      // Check if this is truly the end of a sentence (followed by whitespace or end of string)
      if (j >= trimmed.length || /\s/.test(trimmed[j]!)) {
        // Exclude decimals/numbers like 3.14 or 6.5
        const isDecimal = Boolean(prev && next && /\d/.test(prev) && /\d/.test(next));
        if (!isDecimal) {
          sentences.push(current.trim());
          current = "";
          // Skip whitespace following the sentence boundary
          while (j < trimmed.length && /\s/.test(trimmed[j]!)) {
            j++;
            i = j - 1;
          }
        }
      }
    }
  }

  if (current.trim()) {
    sentences.push(current.trim());
  }

  return sentences;
}

/**
 * Sentence-boundary-aware truncation.
 * - Never cuts inside a word or a quoted sentence.
 * - If source text exceeds maxWords, truncates at the last complete sentence fitting within maxWords.
 * - If even the first sentence exceeds maxWords, keeps the entire first sentence anyway to preserve narrative integrity.
 */
export function truncateToSentences(text: string, maxWords: number): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";

  const words = trimmed.split(" ");
  if (words.length <= maxWords) return trimmed;

  const sentences = splitIntoSentences(trimmed);
  if (sentences.length === 0) return trimmed;

  let result = "";
  let totalWords = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.split(" ").length;
    // Always keep at least the first sentence, and subsequent sentences if within ceiling
    if (!result || totalWords + sentenceWords <= maxWords) {
      result = result ? `${result} ${sentence}` : sentence;
      totalWords += sentenceWords;
    } else {
      break;
    }
  }

  return result;
}
