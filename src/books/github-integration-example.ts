/**
 * Example usage of the GitHub Library System integration
 * 
 * This file demonstrates how to use the new GitHub integration
 * to fetch repositories and transform them into books.
 */

import { BookService, GitHubService, BookTransformer } from './index'
import { BookCategory } from './types'

// Example 1: Fetch public repositories for a user
export async function fetchUserLibrary(username: string) {
  const bookService = new BookService()
  
  try {
    const result = await bookService.fetchUserBooks(username, {
      includeReadme: true,
      maxRepositories: 50
    })
    
    console.log(`Fetched ${result.books.length} books for ${username}`)
    console.log('Categories found:', [...new Set(result.books.map(b => b.category))])
    
    if (result.errors.length > 0) {
      console.warn('Errors occurred:', result.errors)
    }
    
    return result.books
  } catch (error) {
    console.error('Failed to fetch user library:', error)
    return []
  }
}

// Example 2: Fetch authenticated user's repositories (including private)
export async function fetchMyLibrary(githubToken: string) {
  const bookService = new BookService(githubToken)
  
  try {
    const result = await bookService.fetchAuthenticatedUserBooks({
      includeReadme: true,
      includePrivate: true,
      maxRepositories: 100
    })
    
    console.log(`Fetched ${result.books.length} of your books`)
    
    // Categorize books
    const categorized = bookService.categorizeBooks(result.books)
    Object.entries(categorized).forEach(([category, books]) => {
      if (books.length > 0) {
        console.log(`${category}: ${books.length} books`)
      }
    })
    
    return result.books
  } catch (error) {
    console.error('Failed to fetch your library:', error)
    return []
  }
}

// Example 3: Fetch a specific repository
export async function fetchSpecificBook(owner: string, repo: string) {
  const bookService = new BookService()
  
  try {
    const book = await bookService.fetchSingleBook(owner, repo, true)
    
    if (book) {
      console.log(`Fetched book: ${book.title}`)
      console.log(`Category: ${book.category}`)
      console.log(`Stars: ${book.githubMeta?.stars || 0}`)
      console.log(`Language: ${book.githubMeta?.language || 'Unknown'}`)
      
      if (book.readmeContent) {
        console.log(`README length: ${book.readmeContent.length} characters`)
      }
    } else {
      console.log('Book not found or inaccessible')
    }
    
    return book
  } catch (error) {
    console.error('Failed to fetch specific book:', error)
    return null
  }
}

// Example 4: Search and filter books
export async function searchAndFilterBooks(books: any[], query: string) {
  const bookService = new BookService()
  
  // Search by query
  const searchResults = bookService.searchBooks(books, query)
  console.log(`Found ${searchResults.length} books matching "${query}"`)
  
  // Filter by category and language
  const webApps = bookService.filterBooks(books, {
    categories: [BookCategory.WEB_APPS],
    languages: ['JavaScript', 'TypeScript']
  })
  console.log(`Found ${webApps.length} JavaScript/TypeScript web applications`)
  
  // Sort by stars
  const popularBooks = bookService.sortBooks(books, 'stars').slice(0, 10)
  console.log('Top 10 most starred books:')
  popularBooks.forEach((book, index) => {
    console.log(`${index + 1}. ${book.title} (${book.githubMeta?.stars || 0} stars)`)
  })
  
  return {
    searchResults,
    webApps,
    popularBooks
  }
}

// Example 5: Direct GitHub API usage
export async function directGitHubApiExample(username: string) {
  const githubService = new GitHubService()
  
  try {
    // Fetch user profile
    const userProfile = await githubService.getUserProfile(username)
    console.log(`User: ${userProfile.name || userProfile.login}`)
    console.log(`Public repos: ${userProfile.public_repos}`)
    
    // Fetch repositories
    const repositories = await githubService.getUserRepositories(username, 1, 10)
    console.log(`Fetched ${repositories.length} repositories`)
    
    // Transform to books
    const books = await BookTransformer.transformRepositories(repositories)
    console.log(`Transformed to ${books.length} books`)
    
    return books
  } catch (error) {
    console.error('Direct GitHub API example failed:', error)
    return []
  }
}

// Example usage in a React component or application:
/*
import { fetchUserLibrary, fetchMyLibrary } from './github-integration-example'

// In your component or app initialization:
const loadUserBooks = async () => {
  const books = await fetchUserLibrary('octocat')
  // Update your application state with the books
  setBooks(books)
}

// With authentication:
const loadMyBooks = async () => {
  const token = localStorage.getItem('github_token')
  if (token) {
    const books = await fetchMyLibrary(token)
    setBooks(books)
  }
}
*/