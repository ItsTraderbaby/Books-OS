import { SearchEngine } from './search-engine'
import { Book, BookCategory } from './types'

// Mock book data for testing
const mockBooks: Book[] = [
  {
    id: 'book1',
    title: 'React Dashboard',
    subtitle: 'Modern admin interface',
    description: 'A comprehensive React dashboard with TypeScript',
    author: 'john-doe',
    category: BookCategory.WEB_APPS,
    tags: ['react', 'typescript', 'dashboard'],
    sectionId: 'sec-web-apps',
    ownerId: 'user1',
    ownerName: 'John Doe',
    isPublic: true,
    likes: 15,
    githubMeta: {
      githubId: 123,
      githubUrl: 'https://github.com/john-doe/react-dashboard',
      cloneUrl: 'https://github.com/john-doe/react-dashboard.git',
      sshUrl: 'git@github.com:john-doe/react-dashboard.git',
      defaultBranch: 'main',
      isPrivate: false,
      language: 'TypeScript',
      stars: 42,
      watchers: 8,
      forks: 12,
      openIssues: 3,
      lastCommit: new Date('2024-01-15'),
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2024-01-15'),
      pushedAt: new Date('2024-01-15'),
      size: 1024,
      isArchived: false,
      isDisabled: false,
      topics: ['react', 'dashboard', 'admin', 'typescript'],
      license: {
        key: 'mit',
        name: 'MIT License',
        spdxId: 'MIT'
      }
    },
    readmeContent: '# React Dashboard\n\nA modern dashboard built with React and TypeScript.'
  },
  {
    id: 'book2',
    title: 'Python ML Library',
    subtitle: 'Machine learning utilities',
    description: 'A collection of machine learning utilities in Python',
    author: 'jane-smith',
    category: BookCategory.AI_ML,
    tags: ['python', 'machine-learning', 'data-science'],
    sectionId: 'sec-ai-ml',
    ownerId: 'user2',
    ownerName: 'Jane Smith',
    isPublic: true,
    likes: 28,
    githubMeta: {
      githubId: 456,
      githubUrl: 'https://github.com/jane-smith/python-ml',
      cloneUrl: 'https://github.com/jane-smith/python-ml.git',
      sshUrl: 'git@github.com:jane-smith/python-ml.git',
      defaultBranch: 'main',
      isPrivate: false,
      language: 'Python',
      stars: 156,
      watchers: 23,
      forks: 34,
      openIssues: 8,
      lastCommit: new Date('2024-01-20'),
      createdAt: new Date('2023-03-15'),
      updatedAt: new Date('2024-01-20'),
      pushedAt: new Date('2024-01-20'),
      size: 2048,
      isArchived: false,
      isDisabled: false,
      topics: ['python', 'machine-learning', 'data-science', 'ai'],
      license: {
        key: 'apache-2.0',
        name: 'Apache License 2.0',
        spdxId: 'Apache-2.0'
      }
    },
    readmeContent: '# Python ML Library\n\nUtilities for machine learning projects.'
  },
  {
    id: 'book3',
    title: 'Game Engine',
    subtitle: '2D game development',
    description: 'A lightweight 2D game engine written in C++',
    author: 'bob-wilson',
    category: BookCategory.GAMES,
    tags: ['cpp', 'game-engine', '2d'],
    sectionId: 'sec-games',
    ownerId: 'user3',
    ownerName: 'Bob Wilson',
    isPublic: true,
    likes: 7,
    githubMeta: {
      githubId: 789,
      githubUrl: 'https://github.com/bob-wilson/game-engine',
      cloneUrl: 'https://github.com/bob-wilson/game-engine.git',
      sshUrl: 'git@github.com:bob-wilson/game-engine.git',
      defaultBranch: 'main',
      isPrivate: false,
      language: 'C++',
      stars: 23,
      watchers: 5,
      forks: 7,
      openIssues: 12,
      lastCommit: new Date('2024-01-10'),
      createdAt: new Date('2023-08-20'),
      updatedAt: new Date('2024-01-10'),
      pushedAt: new Date('2024-01-10'),
      size: 512,
      isArchived: false,
      isDisabled: false,
      topics: ['cpp', 'game-engine', '2d-graphics', 'opengl']
    },
    readmeContent: '# Game Engine\n\nA simple 2D game engine for learning purposes.'
  }
]

describe('SearchEngine', () => {
  let searchEngine: SearchEngine

  beforeEach(() => {
    searchEngine = new SearchEngine(mockBooks)
  })

  describe('Basic Search', () => {
    test('should return all books when no query provided', () => {
      const result = searchEngine.search({
        text: '',
        filters: {}
      })

      expect(result.books).toHaveLength(3)
      expect(result.totalCount).toBe(3)
    })

    test('should find books by title', () => {
      const result = searchEngine.search({
        text: 'React',
        filters: {}
      })

      expect(result.books).toHaveLength(1)
      expect(result.books[0].title).toBe('React Dashboard')
    })

    test('should find books by description', () => {
      const result = searchEngine.search({
        text: 'machine learning',
        filters: {}
      })

      expect(result.books).toHaveLength(1)
      expect(result.books[0].title).toBe('Python ML Library')
    })

    test('should find books by author', () => {
      const result = searchEngine.search({
        text: 'jane-smith',
        filters: {}
      })

      expect(result.books).toHaveLength(1)
      expect(result.books[0].author).toBe('jane-smith')
    })
  })

  describe('Filtering', () => {
    test('should filter by category', () => {
      const result = searchEngine.search({
        text: '',
        filters: {
          categories: [BookCategory.AI_ML]
        }
      })

      expect(result.books).toHaveLength(1)
      expect(result.books[0].category).toBe(BookCategory.AI_ML)
    })

    test('should filter by language', () => {
      const result = searchEngine.search({
        text: '',
        filters: {
          languages: ['Python']
        }
      })

      expect(result.books).toHaveLength(1)
      expect(result.books[0].githubMeta?.language).toBe('Python')
    })

    test('should filter by author', () => {
      const result = searchEngine.search({
        text: '',
        filters: {
          authors: ['john-doe']
        }
      })

      expect(result.books).toHaveLength(1)
      expect(result.books[0].author).toBe('john-doe')
    })

    test('should filter by minimum stars', () => {
      const result = searchEngine.search({
        text: '',
        filters: {
          minStars: 50
        }
      })

      expect(result.books).toHaveLength(1)
      expect(result.books[0].githubMeta?.stars).toBeGreaterThanOrEqual(50)
    })
  })

  describe('Sorting', () => {
    test('should sort by popularity', () => {
      const result = searchEngine.search({
        text: '',
        filters: {
          sortBy: 'popularity'
        }
      })

      expect(result.books[0].githubMeta?.stars).toBeGreaterThanOrEqual(
        result.books[1].githubMeta?.stars || 0
      )
    })

    test('should sort alphabetically', () => {
      const result = searchEngine.search({
        text: '',
        filters: {
          sortBy: 'alphabetical'
        }
      })

      expect(result.books[0].title).toBe('Game Engine')
      expect(result.books[1].title).toBe('Python ML Library')
      expect(result.books[2].title).toBe('React Dashboard')
    })
  })

  describe('Facets', () => {
    test('should calculate category facets', () => {
      const result = searchEngine.search({
        text: '',
        filters: {}
      })

      expect(result.facets.categories).toHaveProperty(BookCategory.WEB_APPS, 1)
      expect(result.facets.categories).toHaveProperty(BookCategory.AI_ML, 1)
      expect(result.facets.categories).toHaveProperty(BookCategory.GAMES, 1)
    })

    test('should calculate language facets', () => {
      const result = searchEngine.search({
        text: '',
        filters: {}
      })

      expect(result.facets.languages).toHaveProperty('TypeScript', 1)
      expect(result.facets.languages).toHaveProperty('Python', 1)
      expect(result.facets.languages).toHaveProperty('C++', 1)
    })
  })

  describe('Suggestions', () => {
    test('should generate suggestions', () => {
      const suggestions = searchEngine.getSuggestions('react')

      expect(suggestions).toContain('React Dashboard')
    })

    test('should generate author suggestions', () => {
      const suggestions = searchEngine.getSuggestions('john')

      expect(suggestions).toContain('john-doe')
    })
  })

  describe('Available Filters', () => {
    test('should return available categories', () => {
      const filters = searchEngine.getAvailableFilters()

      expect(filters.availableCategories).toContain(BookCategory.WEB_APPS)
      expect(filters.availableCategories).toContain(BookCategory.AI_ML)
      expect(filters.availableCategories).toContain(BookCategory.GAMES)
    })

    test('should return available languages', () => {
      const filters = searchEngine.getAvailableFilters()

      expect(filters.availableLanguages).toContain('TypeScript')
      expect(filters.availableLanguages).toContain('Python')
      expect(filters.availableLanguages).toContain('C++')
    })

    test('should return available authors', () => {
      const filters = searchEngine.getAvailableFilters()

      expect(filters.availableAuthors).toContain('john-doe')
      expect(filters.availableAuthors).toContain('jane-smith')
      expect(filters.availableAuthors).toContain('bob-wilson')
    })
  })
})

// Simple test runner for browser environment
if (typeof window !== 'undefined') {
  console.log('Running SearchEngine tests...')
  
  const engine = new SearchEngine(mockBooks)
  
  // Test basic search
  const searchResult = engine.search({
    text: 'React',
    filters: {}
  })
  
  console.log('Search for "React":', searchResult.books.length === 1 ? '✅ PASS' : '❌ FAIL')
  
  // Test filtering
  const filterResult = engine.search({
    text: '',
    filters: {
      categories: [BookCategory.AI_ML]
    }
  })
  
  console.log('Filter by AI_ML:', filterResult.books.length === 1 ? '✅ PASS' : '❌ FAIL')
  
  // Test suggestions
  const suggestions = engine.getSuggestions('react')
  console.log('Suggestions for "react":', suggestions.length > 0 ? '✅ PASS' : '❌ FAIL')
  
  console.log('All tests completed!')
}