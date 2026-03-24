
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

    const matrix = [];
    for (let i = 0; i <= clean2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= clean1.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= clean2.length; i++) {
      for (let j = 1; j <= clean1.length; j++) {
        if (clean2.charAt(i - 1) === clean1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    const distance = matrix[clean2.length][clean1.length];
    const maxLength = Math.max(clean1.length, clean2.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;
    
    return Math.round(similarity);
  }

  private static normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "") // Remove punctuation
      .replace(/\s{2,}/g, " ") // Extra spaces
      .trim();
  }
}
