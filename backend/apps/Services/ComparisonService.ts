
export class ComparisonService {
  /**
   * Calculates similarity between two strings using Levenshtein distance
   * Returns a percentage 0-100
   */
  static calculateSimilarity(s1: string, s2: string): number {
    const clean1 = this.normalize(s1);
    const clean2 = this.normalize(s2);

    if (clean1 === clean2) return 100;
    if (clean1.length === 0 || clean2.length === 0) return 0;

    const words1 = clean1.split(" ");
    const words2 = clean2.split(" ");

    // Word-level LCS (Longest Common Subsequence)
    const n = words1.length;
    const m = words2.length;
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (words1[i - 1] === words2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcsLength = dp[n][m];
    
    // Similarity = (LCS / Max(words1, words2)) * 100
    // But for pronunciation, we usually care about how much of the EXPECTED sentence was covered.
    // So (LCS / expected.length) * 100, but with a penalty for EXTRA words in transcript.
    const expectedLength = words1.length;
    const transcriptLength = words2.length;
    
    // Base score based on how many words correctly matched in order
    let score = (lcsLength / expectedLength) * 100;

    // Penalty for extra words (hallucinations or noise)
    if (transcriptLength > expectedLength) {
        const extraWords = transcriptLength - expectedLength;
        const penalty = (extraWords / transcriptLength) * 20; // Up to 20% penalty
        score = Math.max(0, score - penalty);
    }
    
    return Math.round(score);
  }

  private static normalize(text: string): string {
    const numberMap: { [key: string]: string } = {
      "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
      "eleven": "11", "twelve": "12", "thirteen": "13", "fourteen": "14", "fifteen": "15", "sixteen": "16", "seventeen": "17", "eighteen": "18", "nineteen": "19",
      "twenty": "20", "thirty": "30", "forty": "40", "fifty": "50", "sixty": "60", "seventy": "70", "eighty": "80", "ninety": "90", "hundred": "100"
    };

    let result = text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    // Replace words with numbers
    const words = result.split(" ");
    const normalizedWords = words.map(w => numberMap[w] || w);
    
    return normalizedWords.join(" ");
  }
}
