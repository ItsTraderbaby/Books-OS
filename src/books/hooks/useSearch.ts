import { useState, useEffect, useMemo } from 'react'
import { SearchEngine, SearchQuery, SearchResult, SearchFilters } from '../search-engine'
import { Book } from '../types'
import { useDebouncedSearch } from './useDebounce'

export interface UseSearchOptions {
  books: Book[]
  initialQuery?: string
  initialFilters?: Partial<SearchFilters>
  debounceDelay?: number
  pageSize?: number
}

export interface UseSearchReturn {
  // Search state
  query: string
  setQuery: (query: string) => void
  isSearching: boolean
  
  // Filters
  filters: SearchFilters
  setFilters: (filters: Partial<SearchFilters>) => void
  clearFilters: () => void
  
  // Results
  results: SearchResult | null
  books: Book[]
  totalCount: number
  hasMore: boolean
  
  // Pagination
  currentPage: number
  totalPages: number
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  
  // Facets and suggestions
  facets: SearchResult['facets'] | null
  suggestions: string[]
  
  // Filter options
  availableFilters: ReturnType<SearchEngine['getAvailableFilters']> | null
  
  // Performance
  searchTime: number
}

const defaultFilters: SearchFilters = {
  categories: [],
  authors: [],
  languages: [],
  visibility: 'all',
  sortBy: 'relevance'
}

export function useSearch({
  books,
  initialQuery = '',
  initialFilters = {},
  debounceDelay = 300,
  pageSize = 20
}: UseSearchOptions): UseSearchReturn {
  // Search engine instance
  const searchEngine = useMemo(() => new SearchEngine(books), [books])
  
  // Update search engine when books change
  useEffect(() => {
    searchEngine.setBooks(books)
  }, [books, searchEngine])

  // Search query with debouncing
  const { query, setQuery, debouncedQuery, isSearching } = useDebouncedSearch(
    initialQuery,
    debounceDelay
  )

  // Search filters
  const [filters, setFiltersState] = useState<SearchFilters>({
    ...defaultFilters,
    ...initialFilters
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Search results
  const [results, setResults] = useState<SearchResult | null>(null)

  // Available filter options
  const [availableFilters, setAvailableFilters] = useState<ReturnType<SearchEngine['getAvailableFilters']> | null>(null)

  // Update available filters when books change
  useEffect(() => {
    if (books.length > 0) {
      setAvailableFilters(searchEngine.getAvailableFilters())
    }
  }, [books, searchEngine])

  // Perform search when query or filters change
  useEffect(() => {
    const searchQuery: SearchQuery = {
      text: debouncedQuery,
      filters,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }

    const searchResults = searchEngine.search(searchQuery)
    setResults(searchResults)
  }, [debouncedQuery, filters, currentPage, pageSize, searchEngine])

  // Reset to first page when query or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, filters])

  // Helper functions
  const setFilters = (newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFiltersState(defaultFilters)
  }

  const nextPage = () => {
    if (results && currentPage < Math.ceil(results.totalCount / pageSize)) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    const totalPages = results ? Math.ceil(results.totalCount / pageSize) : 1
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Computed values
  const totalPages = results ? Math.ceil(results.totalCount / pageSize) : 1
  const hasMore = currentPage < totalPages

  return {
    // Search state
    query,
    setQuery,
    isSearching,
    
    // Filters
    filters,
    setFilters,
    clearFilters,
    
    // Results
    results,
    books: results?.books || [],
    totalCount: results?.totalCount || 0,
    hasMore,
    
    // Pagination
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    
    // Facets and suggestions
    facets: results?.facets || null,
    suggestions: results?.suggestions || [],
    
    // Filter options
    availableFilters,
    
    // Performance
    searchTime: results?.searchTime || 0
  }
}

/**
 * Hook for getting search suggestions without performing full search
 */
export function useSearchSuggestions(books: Book[], query: string) {
  const searchEngine = useMemo(() => new SearchEngine(books), [books])
  
  useEffect(() => {
    searchEngine.setBooks(books)
  }, [books, searchEngine])

  return useMemo(() => {
    if (!query.trim()) return []
    return searchEngine.getSuggestions(query)
  }, [searchEngine, query])
}