import { Book, BookCategory } from './types'
import { SearchRanking, DEFAULT_RANKING_WEIGHTS } from './search-ranking'

export interface SearchFilters {
  categories?: BookCategory[]
  authors?: string[]
  languages?: string[]
  dateRange?: {
    start?: Date
    end?: Date
  }
  visibility?: 'public' | 'private' | 'all'
  sortBy?: 'relevance' | 'date' | 'popularity' | 'alphabetical'
  hasReadme?: boolean
  minStars?: number
}

export interface SearchQuery {
  text: string
  filters: SearchFilters
  limit?: number
  offset?: number
}

export interface SearchResult {
  books: Book[]
  totalCount: number
  facets: SearchFacets
  suggestions: string[]
  searchTime: number
}

export interface SearchFacets {
  categories: { [key: string]: number }
  authors: { [key: string]: number }
  languages: { [key: string]: number }
  years: { [key: string]: number }
}

export interface FilterOptions {
  availableCategories: BookCategory[]
  availableAuthors: string[]
  availableLanguages: string[]
  availableYears: number[]
}

export class SearchEngine {
  private books: Book[] = []
  private searchIndex: Map<string, Set<string>> = new Map()
  private ranking: SearchRanking
  private searchHistory: string[] = []
  private maxHistorySize = 10

  constructor(books: Book[] = []) {
    this.ranking = new SearchRanking(DEFAULT_RANKING_WEIGHTS)
    this.setBooks(books)
  }

  /**
   * Set the books collection and rebuild search index
   */
  setBooks(books: Book[]): void {
    this.books = books
    this.buildSearchIndex()
  }

  /**
   * Add books to the collection and update search index
   */
  addBooks(books: Book[]): void {
    this.books = [...this.books, ...books]
    this.buildSearchIndex()
  }

  /**
   * Remove books from the collection and update search index
   */
  removeBooks(bookIds: string[]): void {
    const idsToRemove = new Set(bookIds)
    this.books = this.books.filter(book => !idsToRemove.has(book.id))
    this.buildSearchIndex()
  }

  /**
   * Main search method with filtering and ranking
   */
  search(query: SearchQuery): SearchResult {
    const startTime = performance.now()
    
    // Add to search history if there's a text query
    if (query.text.trim()) {
      this.addToHistory(query.text.trim())
    }
    
    let results = [...this.books]

    // Apply text search if query provided
    if (query.text.trim()) {
      results = this.performTextSearch(results, query.text.trim())
    }

    // Apply filters
    results = this.applyFilters(results, query.filters)

    // Calculate facets before pagination
    const facets = this.calculateFacets(results)

    // Sort results
    results = this.sortResults(results, query.filters.sortBy || 'relevance', query.text)

    // Apply pagination
    const totalCount = results.length
    const offset = query.offset || 0
    const limit = query.limit || 50
    results = results.slice(offset, offset + limit)

    // Generate suggestions
    const suggestions = this.generateSuggestions(query.text, this.books)

    const searchTime = performance.now() - startTime

    return {
      books: results,
      totalCount,
      facets,
      suggestions,
      searchTime
    }
  }

  /**
   * Get available filter options based on current book collection
   */
  getAvailableFilters(): FilterOptions {
    const categories = new Set<BookCategory>()
    const authors = new Set<string>()
    const languages = new Set<string>()
    const years = new Set<number>()

    this.books.forEach(book => {
      categories.add(book.category)
      authors.add(book.author)
      
      if (book.githubMeta?.language) {
        languages.add(book.githubMeta.language)
      }
      
      if (book.githubMeta?.createdAt) {
        years.add(book.githubMeta.createdAt.getFullYear())
      }
    })

    return {
      availableCategories: Array.from(categories).sort(),
      availableAuthors: Array.from(authors).sort(),
      availableLanguages: Array.from(languages).sort(),
      availableYears: Array.from(years).sort((a, b) => b - a) // Most recent first
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(partialQuery: string): string[] {
    return this.generateSuggestions(partialQuery, this.books)
  }

  /**
   * Build search index for fast text searching
   */
  private buildSearchIndex(): void {
    this.searchIndex.clear()

    this.books.forEach(book => {
      const searchableText = this.getSearchableText(book)
      const words = this.tokenize(searchableText)
      
      words.forEach(word => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set())
        }
        this.searchIndex.get(word)!.add(book.id)
      })
    })
  }

  /**
   * Extract searchable text from a book
   */
  private getSearchableText(book: Book): string {
    const parts = [
      book.title,
      book.subtitle || '',
      book.description || '',
      book.author,
      ...(book.tags || []),
      ...(book.githubMeta?.topics || []),
      book.githubMeta?.language || '',
      book.readmeContent || ''
    ]

    return parts.join(' ').toLowerCase()
  }

  /**
   * Tokenize text into searchable words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter out very short words
  }

  /**
   * Perform text search with ranking
   */
  private performTextSearch(books: Book[], query: string): Book[] {
    return this.ranking.rankBooks(books, query)
  }

  /**
   * Apply filters to book results
   */
  private applyFilters(books: Book[], filters: SearchFilters): Book[] {
    return books.filter(book => {
      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(book.category)) {
          return false
        }
      }

      // Author filter
      if (filters.authors && filters.authors.length > 0) {
        if (!filters.authors.includes(book.author)) {
          return false
        }
      }

      // Language filter
      if (filters.languages && filters.languages.length > 0) {
        const bookLanguage = book.githubMeta?.language
        if (!bookLanguage || !filters.languages.includes(bookLanguage)) {
          return false
        }
      }

      // Date range filter
      if (filters.dateRange) {
        const bookDate = book.githubMeta?.createdAt
        if (bookDate) {
          if (filters.dateRange.start && bookDate < filters.dateRange.start) {
            return false
          }
          if (filters.dateRange.end && bookDate > filters.dateRange.end) {
            return false
          }
        }
      }

      // Visibility filter
      if (filters.visibility && filters.visibility !== 'all') {
        const isPublic = filters.visibility === 'public'
        if (book.isPublic !== isPublic) {
          return false
        }
      }

      // README filter
      if (filters.hasReadme !== undefined) {
        const hasReadme = !!book.readmeContent
        if (hasReadme !== filters.hasReadme) {
          return false
        }
      }

      // Minimum stars filter
      if (filters.minStars !== undefined) {
        const stars = book.githubMeta?.stars || 0
        if (stars < filters.minStars) {
          return false
        }
      }

      return true
    })
  }

  /**
   * Sort results by specified criteria
   */
  private sortResults(books: Book[], sortBy: string, query?: string): Book[] {
    return [...books].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        
        case 'date':
          const aDate = a.githubMeta?.updatedAt || a.githubMeta?.createdAt || new Date(0)
          const bDate = b.githubMeta?.updatedAt || b.githubMeta?.createdAt || new Date(0)
          return bDate.getTime() - aDate.getTime() // Most recent first
        
        case 'popularity':
          const aStars = a.githubMeta?.stars || 0
          const bStars = b.githubMeta?.stars || 0
          if (aStars !== bStars) {
            return bStars - aStars // Most stars first
          }
          // Secondary sort by forks
          const aForks = a.githubMeta?.forks || 0
          const bForks = b.githubMeta?.forks || 0
          return bForks - aForks
        
        case 'relevance':
        default:
          // If there's a query, relevance is already handled by text search
          // Otherwise, sort by a combination of factors
          if (!query) {
            const aScore = this.calculateRelevanceScore(a)
            const bScore = this.calculateRelevanceScore(b)
            return bScore - aScore
          }
          return 0
      }
    })
  }

  /**
   * Calculate relevance score for sorting when no query is provided
   */
  private calculateRelevanceScore(book: Book): number {
    return this.ranking.calculateRelevanceScore(book, '')
  }

  /**
   * Calculate facets for search results
   */
  private calculateFacets(books: Book[]): SearchFacets {
    const categories: { [key: string]: number } = {}
    const authors: { [key: string]: number } = {}
    const languages: { [key: string]: number } = {}
    const years: { [key: string]: number } = {}

    books.forEach(book => {
      // Categories
      categories[book.category] = (categories[book.category] || 0) + 1
      
      // Authors
      authors[book.author] = (authors[book.author] || 0) + 1
      
      // Languages
      if (book.githubMeta?.language) {
        const lang = book.githubMeta.language
        languages[lang] = (languages[lang] || 0) + 1
      }
      
      // Years
      if (book.githubMeta?.createdAt) {
        const year = book.githubMeta.createdAt.getFullYear().toString()
        years[year] = (years[year] || 0) + 1
      }
    })

    return { categories, authors, languages, years }
  }

  /**
   * Generate search suggestions based on query and available books
   */
  private generateSuggestions(query: string, books: Book[]): string[] {
    if (!query.trim()) {
      return []
    }

    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()

    // Suggest book titles that start with or contain the query
    books.forEach(book => {
      if (book.title.toLowerCase().includes(queryLower)) {
        suggestions.add(book.title)
      }
      
      // Suggest author names
      if (book.author.toLowerCase().includes(queryLower)) {
        suggestions.add(book.author)
      }
      
      // Suggest topics
      book.githubMeta?.topics?.forEach(topic => {
        if (topic.toLowerCase().includes(queryLower)) {
          suggestions.add(topic)
        }
      })
      
      // Suggest languages
      if (book.githubMeta?.language?.toLowerCase().includes(queryLower)) {
        suggestions.add(book.githubMeta.language)
      }
    })

    return Array.from(suggestions)
      .filter(suggestion => suggestion.toLowerCase() !== queryLower)
      .slice(0, 5) // Limit to 5 suggestions
      .sort()
  }

  /**
   * Get books count by category
   */
  getBooksByCategory(): Record<BookCategory, Book[]> {
    const categorized: Record<BookCategory, Book[]> = {} as Record<BookCategory, Book[]>

    // Initialize all categories
    Object.values(BookCategory).forEach(category => {
      categorized[category] = []
    })

    // Group books by category
    this.books.forEach(book => {
      categorized[book.category].push(book)
    })

    return categorized
  }

  /**
   * Get total number of books
   */
  getTotalBooks(): number {
    return this.books.length
  }

  /**
   * Get books by IDs
   */
  getBooksByIds(ids: string[]): Book[] {
    const idSet = new Set(ids)
    return this.books.filter(book => idSet.has(book.id))
  }

  /**
   * Update search ranking weights
   */
  setRankingWeights(weights: Partial<typeof DEFAULT_RANKING_WEIGHTS>): void {
    this.ranking.setWeights(weights)
  }

  /**
   * Get current ranking weights
   */
  getRankingWeights(): typeof DEFAULT_RANKING_WEIGHTS {
    return this.ranking.getWeights()
  }

  /**
   * Get the ranking instance for advanced usage
   */
  getRanking(): SearchRanking {
    return this.ranking
  }

  /**
   * Update books collection (alias for setBooks for compatibility)
   */
  updateBooks(books: Book[]): void {
    this.setBooks(books)
  }

  /**
   * Get search statistics
   */
  getSearchStats(): {
    totalBooks: number
    totalCategories: number
    totalAuthors: number
    totalLanguages: number
    indexSize: number
  } {
    const categories = new Set<string>()
    const authors = new Set<string>()
    const languages = new Set<string>()

    this.books.forEach(book => {
      categories.add(book.category)
      authors.add(book.author)
      if (book.githubMeta?.language) {
        languages.add(book.githubMeta.language)
      }
    })

    return {
      totalBooks: this.books.length,
      totalCategories: categories.size,
      totalAuthors: authors.size,
      totalLanguages: languages.size,
      indexSize: this.searchIndex.size
    }
  }

  /**
   * Add search query to history
   */
  private addToHistory(query: string): void {
    if (!query.trim()) return
    
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(q => q !== query)
    
    // Add to beginning
    this.searchHistory.unshift(query)
    
    // Limit size
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * Get recent search queries
   */
  getRecentSearches(): string[] {
    return [...this.searchHistory]
  }

  /**
   * Clear search history
   */
  clearHistory(): void {
    this.searchHistory = []
  }
}