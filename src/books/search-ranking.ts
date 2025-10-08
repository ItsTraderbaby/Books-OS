import { Book } from './types'

export interface RankingFactors {
  titleMatch: number
  subtitleMatch: number
  descriptionMatch: number
  authorMatch: number
  tagMatch: number
  topicMatch: number
  readmeMatch: number
  languageMatch: number
  recentActivity: number
  popularity: number
  completeness: number
}

export interface RankingWeights {
  titleMatch: number
  subtitleMatch: number
  descriptionMatch: number
  authorMatch: number
  tagMatch: number
  topicMatch: number
  readmeMatch: number
  languageMatch: number
  recentActivity: number
  popularity: number
  completeness: number
}

export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  titleMatch: 10.0,
  subtitleMatch: 8.0,
  descriptionMatch: 5.0,
  authorMatch: 4.0,
  tagMatch: 5.0,
  topicMatch: 5.0,
  readmeMatch: 2.0,
  languageMatch: 3.0,
  recentActivity: 3.0,
  popularity: 2.0,
  completeness: 1.0
}

export class SearchRanking {
  private weights: RankingWeights

  constructor(weights: RankingWeights = DEFAULT_RANKING_WEIGHTS) {
    this.weights = weights
  }

  /**
   * Calculate relevance score for a book given a search query
   */
  calculateRelevanceScore(book: Book, query: string): number {
    const queryWords = this.tokenizeQuery(query)
    const factors = this.calculateRankingFactors(book, queryWords)
    
    return this.calculateWeightedScore(factors)
  }

  /**
   * Rank a list of books by relevance to a query
   */
  rankBooks(books: Book[], query: string): Book[] {
    if (!query.trim()) {
      return this.rankByGeneralRelevance(books)
    }

    const booksWithScores = books.map(book => ({
      book,
      score: this.calculateRelevanceScore(book, query)
    }))

    return booksWithScores
      .filter(item => item.score > 0) // Only include books with some relevance
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map(item => item.book)
  }

  /**
   * Rank books by general relevance when no query is provided
   */
  rankByGeneralRelevance(books: Book[]): Book[] {
    return [...books].sort((a, b) => {
      const aScore = this.calculateGeneralRelevanceScore(a)
      const bScore = this.calculateGeneralRelevanceScore(b)
      return bScore - aScore
    })
  }

  /**
   * Update ranking weights
   */
  setWeights(weights: Partial<RankingWeights>): void {
    this.weights = { ...this.weights, ...weights }
  }

  /**
   * Get current ranking weights
   */
  getWeights(): RankingWeights {
    return { ...this.weights }
  }

  /**
   * Tokenize search query into words
   */
  private tokenizeQuery(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1)
  }

  /**
   * Calculate all ranking factors for a book
   */
  private calculateRankingFactors(book: Book, queryWords: string[]): RankingFactors {
    return {
      titleMatch: this.calculateTextMatch(book.title, queryWords),
      subtitleMatch: this.calculateTextMatch(book.subtitle || '', queryWords),
      descriptionMatch: this.calculateTextMatch(book.description || '', queryWords),
      authorMatch: this.calculateTextMatch(book.author, queryWords),
      tagMatch: this.calculateArrayMatch(book.tags || [], queryWords),
      topicMatch: this.calculateArrayMatch(book.githubMeta?.topics || [], queryWords),
      readmeMatch: this.calculateTextMatch(book.readmeContent || '', queryWords),
      languageMatch: this.calculateTextMatch(book.githubMeta?.language || '', queryWords),
      recentActivity: this.calculateRecentActivityScore(book),
      popularity: this.calculatePopularityScore(book),
      completeness: this.calculateCompletenessScore(book)
    }
  }

  /**
   * Calculate weighted score from ranking factors
   */
  private calculateWeightedScore(factors: RankingFactors): number {
    return (
      factors.titleMatch * this.weights.titleMatch +
      factors.subtitleMatch * this.weights.subtitleMatch +
      factors.descriptionMatch * this.weights.descriptionMatch +
      factors.authorMatch * this.weights.authorMatch +
      factors.tagMatch * this.weights.tagMatch +
      factors.topicMatch * this.weights.topicMatch +
      factors.readmeMatch * this.weights.readmeMatch +
      factors.languageMatch * this.weights.languageMatch +
      factors.recentActivity * this.weights.recentActivity +
      factors.popularity * this.weights.popularity +
      factors.completeness * this.weights.completeness
    )
  }

  /**
   * Calculate text match score for a field
   */
  private calculateTextMatch(text: string, queryWords: string[]): number {
    if (!text || queryWords.length === 0) return 0

    const textLower = text.toLowerCase()
    let score = 0

    queryWords.forEach(word => {
      if (textLower.includes(word)) {
        // Exact word match gets higher score
        const wordBoundaryRegex = new RegExp(`\\b${word}\\b`, 'i')
        if (wordBoundaryRegex.test(text)) {
          score += 2
        } else {
          score += 1
        }

        // Bonus for match at the beginning
        if (textLower.startsWith(word)) {
          score += 1
        }
      }
    })

    return score
  }

  /**
   * Calculate match score for array fields (tags, topics)
   */
  private calculateArrayMatch(array: string[], queryWords: string[]): number {
    if (!array || array.length === 0 || queryWords.length === 0) return 0

    let score = 0

    array.forEach(item => {
      queryWords.forEach(word => {
        if (item.toLowerCase().includes(word.toLowerCase())) {
          // Exact match gets higher score
          if (item.toLowerCase() === word.toLowerCase()) {
            score += 3
          } else {
            score += 1
          }
        }
      })
    })

    return score
  }

  /**
   * Calculate recent activity score (0-1)
   */
  private calculateRecentActivityScore(book: Book): number {
    const updatedAt = book.githubMeta?.updatedAt || book.githubMeta?.createdAt
    if (!updatedAt) return 0

    const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    
    // Score decreases over time, with 1.0 for very recent updates
    if (daysSinceUpdate <= 1) return 1.0
    if (daysSinceUpdate <= 7) return 0.8
    if (daysSinceUpdate <= 30) return 0.6
    if (daysSinceUpdate <= 90) return 0.4
    if (daysSinceUpdate <= 365) return 0.2
    
    return 0.1
  }

  /**
   * Calculate popularity score (0-1)
   */
  private calculatePopularityScore(book: Book): number {
    const stars = book.githubMeta?.stars || 0
    const forks = book.githubMeta?.forks || 0
    const watchers = book.githubMeta?.watchers || 0

    // Combine different popularity metrics
    const popularityScore = (stars * 2) + (forks * 3) + watchers

    // Normalize to 0-1 range (logarithmic scale for better distribution)
    if (popularityScore === 0) return 0
    
    return Math.min(1, Math.log10(popularityScore + 1) / 4) // Assumes max ~10k combined score = 1.0
  }

  /**
   * Calculate completeness score (0-1)
   */
  private calculateCompletenessScore(book: Book): number {
    let score = 0
    let maxScore = 0

    // Has description
    maxScore += 1
    if (book.description) score += 1

    // Has README
    maxScore += 1
    if (book.readmeContent) score += 1

    // Has tags
    maxScore += 1
    if (book.tags && book.tags.length > 0) score += 1

    // Has topics
    maxScore += 1
    if (book.githubMeta?.topics && book.githubMeta.topics.length > 0) score += 1

    // Has license
    maxScore += 1
    if (book.githubMeta?.license) score += 1

    // Has language
    maxScore += 1
    if (book.githubMeta?.language) score += 1

    return maxScore > 0 ? score / maxScore : 0
  }

  /**
   * Calculate general relevance score for books without a query
   */
  private calculateGeneralRelevanceScore(book: Book): number {
    const factors = {
      recentActivity: this.calculateRecentActivityScore(book),
      popularity: this.calculatePopularityScore(book),
      completeness: this.calculateCompletenessScore(book)
    }

    return (
      factors.recentActivity * this.weights.recentActivity +
      factors.popularity * this.weights.popularity +
      factors.completeness * this.weights.completeness
    )
  }
}

/**
 * Default search ranking instance
 */
export const defaultSearchRanking = new SearchRanking()

/**
 * Utility function to rank books with default settings
 */
export function rankBooks(books: Book[], query: string): Book[] {
  return defaultSearchRanking.rankBooks(books, query)
}

/**
 * Utility function to calculate relevance score with default settings
 */
export function calculateRelevanceScore(book: Book, query: string): number {
  return defaultSearchRanking.calculateRelevanceScore(book, query)
}