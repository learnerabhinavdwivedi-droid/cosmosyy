import { describe, it, expect } from "vitest";
import { splitIntoSentences, truncateToSentences } from "@/lib/truncation";

describe("Sentence-boundary-aware truncation", () => {
  const apollo11Plaque =
    'Lower half of the Lunar Module Eagle. Served as the launch platform for the ascent stage. Bears a stainless-steel plaque: "Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind."';

  it("never cuts inside the Apollo 11 plaque quote and includes '...we came in peace for all mankind.' in full", () => {
    const result = truncateToSentences(apollo11Plaque, 60);
    expect(result).toContain('We came in peace for all mankind."');
    expect(result).not.toContain("We came in.");
    expect(result).toBe(apollo11Plaque);
  });

  it("keeps the entire first sentence even if it exceeds maxWords", () => {
    const longSingleSentence =
      "Provided a memorable demonstration of reduced lunar gravity — a ball hit one-handed in a bulky spacesuit traveled roughly 40 yards in one-sixth gravity, six times farther than the same swing would achieve on Earth.";
    const result = truncateToSentences(longSingleSentence, 20);
    expect(result).toBe(longSingleSentence);
    expect(result.endsWith("on Earth.")).toBe(true);
  });

  it("never ends mid-word across multiple word ceiling tests", () => {
    const sample =
      "NASA's unmanned probe soft-landed on 20 April 1967. Conrad and Bean walked to it, inspected it, and retrieved the camera. The rest of Surveyor 3 remains on the surface.";

    for (let max = 5; max <= 35; max += 3) {
      const truncated = truncateToSentences(sample, max);
      // The last character must be a valid sentence-ending punctuation or quote
      expect(/[.!?]"?'?$/.test(truncated)).toBe(true);
      // It should not end with an incomplete word
      const lastWord = truncated.split(" ").pop()!;
      expect(lastWord).not.toMatch(/^[a-zA-Z]+$/);
    }
  });

  it("is never a strict character-prefix of the input unless it ends at a sentence boundary", () => {
    const sample =
      "Curiosity landed in Gale Crater on 6 August 2012. It carries 10 scientific instruments. It has been climbing Mount Sharp since 2014.";

    const truncated = truncateToSentences(sample, 15);
    expect(truncated).toBe("Curiosity landed in Gale Crater on 6 August 2012. It carries 10 scientific instruments.");
    const sentences = splitIntoSentences(sample);
    expect(sentences).toHaveLength(3);
    expect(sentences[0]).toBe("Curiosity landed in Gale Crater on 6 August 2012.");
    expect(sentences[1]).toBe("It carries 10 scientific instruments.");
    expect(sentences[2]).toBe("It has been climbing Mount Sharp since 2014.");
  });

  it("handles quotes and nested dialogue properly without splitting inside quotes", () => {
    const quoted =
      'The plaque reads: "We came in peace for all mankind." That was humanity\'s first permanent message.';
    const sentences = splitIntoSentences(quoted);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toBe('The plaque reads: "We came in peace for all mankind."');
    expect(sentences[1]).toBe("That was humanity's first permanent message.");
  });

  it("handles single-quoted phrases and apostrophes without misinterpreting apostrophes as quotes", () => {
    const text =
      "Alan Shepard famously claimed one went 'miles and miles.' Analysis later estimated about 40 yards. Earth's gravity is six times stronger.";
    const sentences = splitIntoSentences(text);
    expect(sentences).toHaveLength(3);
    expect(sentences[0]).toBe("Alan Shepard famously claimed one went 'miles and miles.'");
    expect(sentences[1]).toBe("Analysis later estimated about 40 yards.");
    expect(sentences[2]).toBe("Earth's gravity is six times stronger.");
  });
});
