import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { SearchEngine, SearchQuery, SearchResult, SearchFilters } from '../search-engine'
import { Book } from '../types'

interface SearchContextType {
  searchEngine: SearchEngine
  currentQuery: SearchQuery
  searchResults: SearchResult | null
  isSearching: boolean
  searchHistory: string[]
  
  // Actions
  updateBooks: (books: Book[]) => void
  performSearch: (query: SearchQuery) => void
  updateFilters: (filters: Partial<SearchFilters>) => void
  updateSearchText: (text: string) => void
  clearSearch: () => void
  clearHistory: () => void
  getAvailableFilters: () => ReturnType<SearchEngine['getAvailableFilters']>
  getSearchStats: () => ReturnType<SearchEngine['getSearchStats']>
}

const SearchContext = createContext<SearchContextType | null>(null)

interface SearchProviderProps {
  children: ReactNode
  initialBooks?: Book[]
}

export function SearchProvider({ children, initialBooks = [] }: SearchProviderProps) {
  const [searchEngine] = useState(() => new SearchEngine(initialBooks))
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>({
    text: '',
    filters: {
      sortBy: 'relevance'
    }
  })
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const updateBooks = useCallback((books: Book[]) => {
    searchEngine.updateBooks(books)
  }, [searchEngine])

  const performSearch = useCallback((query: SearchQuery) => {
    setIsSearching(true)
    setCurrentQuery(query)
    
    try {
      const results = searchEngine.search(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults({
        books: [],
        totalCount: 0,
        facets: { categories: {}, authors: {}, languages: {}, years: {} },
        suggestions: []
      })
    } finally {
      setIsSearching(false)
    }
  }, [searchEngine])

  const updateFilters = useCallback((filters: Partial<SearchFilters>) => {
    const newQuery = {
      ...currentQuery,
      filters: {
        ...currentQuery.filters,
        ...filters
      }
    }
    performSearch(newQuery)
  }, [currentQuery, performSearch])

  const updateSearchText = useCallback((text: string) => {
    const newQuery = {
      ...currentQuery,
      text
    }
    performSearch(newQuery)
  }, [currentQuery, performSearch])

  const clearSearch = useCallback(() => {
    const emptyQuery: SearchQuery = {
      text: '',
      filters: {
        sortBy: 'relevance'
      }
    }
    setCurrentQuery(emptyQuery)
    setSearchResults(null)
  }, [])

  const clearHistory = useCallback(() => {
    searchEngine.clearHistory()
  }, [searchEngine])

  const getAvailableFilters = useCallback(() => {
    return searchEngine.getAvailableFilters()
  }, [searchEngine])

  const getSearchStats = useCallback(() => {
    return searchEngine.getSearchStats()
  }, [searchEngine])

  const searchHistory = searchEngine.getRecentSearches()

  const contextValue: SearchContextType = {
    searchEngine,
    currentQuery,
    searchResults,
    isSearching,
    searchHistory,
    updateBooks,
    performSearch,
    updateFilters,
    updateSearchText,
    clearSearch,
    clearHistory,
    getAvailableFilters,
    getSearchStats
  }

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}