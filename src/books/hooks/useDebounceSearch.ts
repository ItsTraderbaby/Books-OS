import { useState, useEffect, useCallback } from 'react'

export interface UseDebounceSearchOptions {
  delay?: number
  minLength?: number
}

export interface UseDebounceSearchResult<T> {
  query: string
  debouncedQuery: string
  results: T[]
  isSearching: boolean
  setQuery: (query: string) => void
  clearQuery: () => void
  executeSearch: (query: string) => void
}

/**
 * Custom hook for debounced search functionality
 * Provides real-time search with configurable delay and minimum query length
 */
export function useDebounceSearch<T>(
  searchFunction: (query: string) => Promise<T[]> | T[],
  options: UseDebounceSearchOptions = {}
): UseDebounceSearchResult<T> {
  const { delay = 300, minLength = 1 } = options
  
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay])

  // Execute search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < minLength) {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      
      try {
        const searchResults = await searchFunction(debouncedQuery)
        setResults(searchResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedQuery, minLength, searchFunction])

  const clearQuery = useCallback(() => {
    setQuery('')
    setResults([])
  }, [])

  const executeSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(true)
    
    try {
      const searchResults = await searchFunction(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchFunction])

  return {
    query,
    debouncedQuery,
    results,
    isSearching,
    setQuery,
    clearQuery,
    executeSearch
  }
}