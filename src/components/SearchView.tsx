import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Grid, List, Clock, TrendingUp, Calendar, AlignLeft } from 'lucide-react'
import { FilterPanel } from './FilterPanel'
import { useSearch } from '../books/hooks/useSearch'
import { SearchFilters } from '../books/search-engine'
import { Book, User } from '../books/types'

interface SearchViewProps {
  books: Book[]
  user: User
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onOpenBook: (book: Book) => void
}

interface SearchResultCardProps {
  book: Book
  onClick: () => void
  searchQuery: string
}

function SearchResultCard({ book, onClick, searchQuery }: SearchResultCardProps) {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-amber-200 text-amber-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`h-20 bg-gradient-to-br ${book.color || 'from-gray-600 to-gray-800'} p-3 text-white relative`}>
        <div className="flex items-start justify-between">
          <div className="text-lg">{book.emoji || '📚'}</div>
          <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded">
            {book.githubMeta?.stars || 0} ⭐
          </div>
        </div>
        <div className="font-semibold text-sm leading-tight mt-1">
          {highlightText(book.title, searchQuery)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
          {book.description && highlightText(book.description, searchQuery)}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>by {highlightText(book.author, searchQuery)}</span>
          <span>{book.githubMeta?.language}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
              {book.category.replace('-', ' ')}
            </span>
            {book.githubMeta?.isPrivate === false && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Public
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <TrendingUp size={12} />
              {book.githubMeta?.forks || 0}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {book.githubMeta?.updatedAt ? 
                new Date(book.githubMeta.updatedAt).toLocaleDateString() : 
                'Unknown'
              }
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface SearchStatsProps {
  totalResults: number
  searchTime: number
  currentQuery: string
}

function SearchStats({ totalResults, searchTime, currentQuery }: SearchStatsProps) {
  return (
    <motion.div 
      className="flex items-center justify-between text-sm text-gray-600 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div>
        {totalResults > 0 ? (
          <>
            Found <span className="font-semibold text-gray-900">{totalResults.toLocaleString()}</span> books
            {currentQuery && (
              <> for "<span className="font-medium text-amber-700">{currentQuery}</span>"</>
            )}
          </>
        ) : currentQuery ? (
          <>No books found for "<span className="font-medium text-amber-700">{currentQuery}</span>"</>
        ) : (
          'Enter a search term to find books'
        )}
      </div>
      {searchTime > 0 && (
        <div className="text-xs text-gray-500">
          Search completed in {searchTime.toFixed(1)}ms
        </div>
      )}
    </motion.div>
  )
}

interface ViewToggleProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'grid' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid size={16} />
        Grid
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'list' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List size={16} />
        List
      </button>
    </div>
  )
}

export function SearchView({ books, user, searchQuery, onSearchQueryChange, onOpenBook }: SearchViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  
  const {
    query,
    setQuery,
    isSearching,
    filters,
    setFilters,
    clearFilters,
    results,
    books: searchResults,
    totalCount,
    facets,
    suggestions,
    availableFilters,
    searchTime
  } = useSearch({
    books,
    initialQuery: searchQuery,
    debounceDelay: 300,
    pageSize: 20
  })

  // Sync with parent search query
  useEffect(() => {
    if (searchQuery !== query) {
      setQuery(searchQuery)
    }
  }, [searchQuery, query, setQuery])

  // Sync query changes back to parent
  useEffect(() => {
    if (query !== searchQuery) {
      onSearchQueryChange(query)
    }
  }, [query, searchQuery, onSearchQueryChange])

  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    clearFilters()
  }

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="h-6 w-6 text-amber-600" />
              Search Books
            </h1>
            <p className="text-gray-600 mt-1">
              Discover books from your GitHub repositories
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Search Controls */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <SearchStats 
              totalResults={totalCount}
              searchTime={searchTime}
              currentQuery={query}
            />
          </div>
          
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableFilters={availableFilters}
            isOpen={isFilterPanelOpen}
            onToggle={toggleFilterPanel}
            onClearFilters={handleClearFilters}
            resultCount={totalCount}
          />
        </div>
      </div>

      {/* Search Suggestions */}
      {suggestions.length > 0 && query.trim() && (
        <motion.div 
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-sm font-medium text-amber-800 mb-2">
            Did you mean:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="text-sm bg-white border border-amber-300 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            <span>Searching books...</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && (
        <AnimatePresence mode="wait">
          {searchResults.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <SearchResultCard
                        book={book}
                        onClick={() => onOpenBook(book)}
                        searchQuery={query}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((book, index) => (
                    <motion.div
                      key={book.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onOpenBook(book)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${book.color || 'from-gray-600 to-gray-800'} flex items-center justify-center text-white text-xl flex-shrink-0`}>
                          {book.emoji || '📚'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                              {book.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0 ml-4">
                              <span className="flex items-center gap-1">
                                ⭐ {book.githubMeta?.stars || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp size={14} />
                                {book.githubMeta?.forks || 0}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {book.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span>by {book.author}</span>
                              <span>•</span>
                              <span>{book.githubMeta?.language}</span>
                              <span>•</span>
                              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                                {book.category.replace('-', ' ')}
                              </span>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              Updated {book.githubMeta?.updatedAt ? 
                                new Date(book.githubMeta.updatedAt).toLocaleDateString() : 
                                'Unknown'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : query.trim() ? (
            <motion.div
              key="no-results"
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any books matching your search. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setQuery('')}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Clear Search
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start searching
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter a search term above to discover books from your GitHub repositories. 
                You can search by title, author, description, or programming language.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Recent searches will appear here</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}