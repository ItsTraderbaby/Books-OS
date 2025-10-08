// Export all types
export * from './types'

// Export services
export { GitHubService, githubService } from './github-service'
export { BookService } from './book-service'
export { BookTransformer } from './book-transformer'

// Export existing data and utilities
export * from './data'

// Re-export commonly used types for convenience
export type {
  Book,
  GitHubBookMeta,
  ProjectItem,
  User,
  Section
} from './types'

// Export BookCategory as value (enum)
export { BookCategory } from './types'

export type {
  GitHubRepository,
  GitHubUser,
  GitHubReadme
} from './github-service'

export type {
  BookSyncOptions,
  BookSyncResult
} from './book-service'