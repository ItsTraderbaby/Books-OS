import { Book, BookCategory } from './types'
import { GitHubService, GitHubRepository } from './github-service'
import { BookTransformer } from './book-transformer'

export interface BookSyncOptions {
  includeReadme?: boolean
  includePrivate?: boolean
  maxRepositories?: number
}

export interface BookSyncResult {
  books: Book[]
  totalFetched: number
  errors: string[]
}

export class BookService {
  private githubService: GitHubService

  constructor(githubToken?: string) {
    this.githubService = new GitHubService(githubToken)
  }

  /**
   * Fetch and transform GitHub repositories for a specific user
   */
  async fetchUserBooks(
    username: string, 
    options: BookSyncOptions = {}
  ): Promise<BookSyncResult> {
    const {
      includeReadme = false,
      maxRepositories = 100
    } = options

    const errors: string[] = []
    let allRepositories: GitHubRepository[] = []

    try {
      // Fetch repositories in batches
      let page = 1
      const perPage = 30
      let hasMore = true

      while (hasMore && allRepositories.length < maxRepositories) {
        const repositories = await this.githubService.getUserRepositories(
          username, 
          page, 
          perPage
        )

        if (repositories.length === 0) {
          hasMore = false
        } else {
          allRepositories = allRepositories.concat(repositories)
          page++
        }

        // Respect rate limits
        if (repositories.length < perPage) {
          hasMore = false
        }
      }

      // Limit to maxRepositories
      if (allRepositories.length > maxRepositories) {
        allRepositories = allRepositories.slice(0, maxRepositories)
      }

      // Transform repositories to books
      const books = await BookTransformer.transformRepositories(
        allRepositories,
        includeReadme,
        includeReadme ? this.githubService : undefined
      )

      return {
        books,
        totalFetched: allRepositories.length,
        errors
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      errors.push(`Failed to fetch repositories for ${username}: ${errorMessage}`)
      
      return {
        books: [],
        totalFetched: 0,
        errors
      }
    }
  }

  /**
   * Fetch and transform authenticated user's repositories
   */
  async fetchAuthenticatedUserBooks(
    options: BookSyncOptions = {}
  ): Promise<BookSyncResult> {
    if (!this.githubService.isAuthenticated()) {
      return {
        books: [],
        totalFetched: 0,
        errors: ['GitHub authentication token required']
      }
    }

    const {
      includeReadme = false,
      includePrivate = true,
      maxRepositories = 100
    } = options

    const errors: string[] = []
    let allRepositories: GitHubRepository[] = []

    try {
      // Fetch repositories in batches
      let page = 1
      const perPage = 30
      let hasMore = true

      while (hasMore && allRepositories.length < maxRepositories) {
        const repositories = await this.githubService.getAuthenticatedUserRepositories(
          page, 
          perPage
        )

        if (repositories.length === 0) {
          hasMore = false
        } else {
          // Filter out private repositories if not requested
          const filteredRepos = includePrivate 
            ? repositories 
            : repositories.filter(repo => !repo.private)
          
          allRepositories = allRepositories.concat(filteredRepos)
          page++
        }

        // Respect rate limits
        if (repositories.length < perPage) {
          hasMore = false
        }
      }

      // Limit to maxRepositories
      if (allRepositories.length > maxRepositories) {
        allRepositories = allRepositories.slice(0, maxRepositories)
      }

      // Transform repositories to books
      const books = await BookTransformer.transformRepositories(
        allRepositories,
        includeReadme,
        includeReadme ? this.githubService : undefined
      )

      return {
        books,
        totalFetched: allRepositories.length,
        errors
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      errors.push(`Failed to fetch authenticated user repositories: ${errorMessage}`)
      
      return {
        books: [],
        totalFetched: 0,
        errors
      }
    }
  }

  /**
   * Fetch a single repository and convert it to a book
   */
  async fetchSingleBook(
    owner: string, 
    repoName: string, 
    includeReadme = true
  ): Promise<Book | null> {
    try {
      const repository = await this.githubService.getRepository(owner, repoName)
      
      let readmeContent: string | undefined
      if (includeReadme) {
        readmeContent = await this.githubService.getRepositoryReadme(owner, repoName) || undefined
      }

      return BookTransformer.transformGitHubRepositoryToBook(repository, readmeContent)
    } catch (error) {
      console.error(`Failed to fetch repository ${owner}/${repoName}:`, error)
      return null
    }
  }

  /**
   * Update README content for an existing book
   */
  async updateBookReadme(book: Book): Promise<string | null> {
    if (!book.githubMeta) {
      return null
    }

    try {
      const [owner, repo] = book.githubMeta.githubUrl
        .replace('https://github.com/', '')
        .split('/')

      return await this.githubService.getRepositoryReadme(owner, repo)
    } catch (error) {
      console.error(`Failed to update README for book ${book.title}:`, error)
      return null
    }
  }

  /**
   * Categorize books by their category
   */
  categorizeBooks(books: Book[]): Record<BookCategory, Book[]> {
    const categorized: Record<BookCategory, Book[]> = {} as Record<BookCategory, Book[]>

    // Initialize all categories
    Object.values(BookCategory).forEach(category => {
      categorized[category] = []
    })

    // Group books by category
    books.forEach(book => {
      categorized[book.category].push(book)
    })

    return categorized
  }

  /**
   * Search books by title, description, or tags
   */
  searchBooks(books: Book[], query: string): Book[] {
    if (!query.trim()) {
      return books
    }

    const searchTerm = query.toLowerCase().trim()
    
    return books.filter(book => {
      const searchableText = [
        book.title,
        book.subtitle || '',
        book.description || '',
        book.author,
        ...(book.tags || []),
        ...(book.githubMeta?.topics || [])
      ].join(' ').toLowerCase()

      return searchableText.includes(searchTerm)
    })
  }

  /**
   * Filter books by various criteria
   */
  filterBooks(books: Book[], filters: {
    categories?: BookCategory[]
    authors?: string[]
    languages?: string[]
    isPublic?: boolean
    hasReadme?: boolean
  }): Book[] {
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

      // Public/private filter
      if (filters.isPublic !== undefined) {
        if (book.isPublic !== filters.isPublic) {
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

      return true
    })
  }

  /**
   * Sort books by various criteria
   */
  sortBooks(books: Book[], sortBy: 'title' | 'author' | 'stars' | 'updated' | 'created'): Book[] {
    return [...books].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        
        case 'author':
          return a.author.localeCompare(b.author)
        
        case 'stars':
          const aStars = a.githubMeta?.stars || 0
          const bStars = b.githubMeta?.stars || 0
          return bStars - aStars // Descending order
        
        case 'updated':
          const aUpdated = a.githubMeta?.updatedAt || new Date(0)
          const bUpdated = b.githubMeta?.updatedAt || new Date(0)
          return bUpdated.getTime() - aUpdated.getTime() // Most recent first
        
        case 'created':
          const aCreated = a.githubMeta?.createdAt || new Date(0)
          const bCreated = b.githubMeta?.createdAt || new Date(0)
          return bCreated.getTime() - aCreated.getTime() // Most recent first
        
        default:
          return 0
      }
    })
  }

  /**
   * Set GitHub authentication token
   */
  setGitHubToken(token: string): void {
    this.githubService.setToken(token)
  }

  /**
   * Clear GitHub authentication token
   */
  clearGitHubToken(): void {
    this.githubService.clearToken()
  }

  /**
   * Check if GitHub service is authenticated
   */
  isAuthenticated(): boolean {
    return this.githubService.isAuthenticated()
  }
}