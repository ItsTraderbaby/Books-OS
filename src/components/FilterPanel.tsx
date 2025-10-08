import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { SearchFilters, FilterOptions } from '../books/search-engine'
import { BookCategory } from '../books/types'

export interface FilterPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  availableFilters: FilterOptions | null
  isOpen: boolean
  onToggle: () => void
  onClearFilters: () => void
  resultCount?: number
}

interface FilterSectionProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  count?: number
}

function FilterSection({ title, isExpanded, onToggle, children, count }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{title}</span>
          {count !== undefined && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CheckboxFilterProps {
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  maxVisible?: number
}

function CheckboxFilter({ options, selectedValues, onChange, maxVisible = 8 }: CheckboxFilterProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleOptions = showAll ? options : options.slice(0, maxVisible)
  const hasMore = options.length > maxVisible

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onChange(newValues)
  }

  return (
    <div className="space-y-2">
      {visibleOptions.map(option => (
        <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={selectedValues.includes(option)}
            onChange={() => handleToggle(option)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-sm text-gray-700 flex-1">{option}</span>
        </label>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium"
        >
          {showAll ? 'Show less' : `Show ${options.length - maxVisible} more`}
        </button>
      )}
    </div>
  )
}

function getCategoryDisplayName(category: BookCategory): string {
  const categoryNames: Record<BookCategory, string> = {
    [BookCategory.GAMES]: 'Games',
    [BookCategory.WEB_APPS]: 'Web Applications',
    [BookCategory.MOBILE_APPS]: 'Mobile Applications',
    [BookCategory.SOCIAL_MEDIA]: 'Social Media',
    [BookCategory.PRODUCTIVITY]: 'Productivity Tools',
    [BookCategory.AI_ML]: 'AI & Machine Learning',
    [BookCategory.UI_DESIGN]: 'UI/UX Design',
    [BookCategory.GRAPHICS]: 'Graphics & Visual Arts',
    [BookCategory.TUTORIALS]: 'Tutorials & Guides',
    [BookCategory.DOCUMENTATION]: 'Technical Documentation',
    [BookCategory.BUSINESS]: 'Business & Strategy',
    [BookCategory.RESEARCH]: 'Research & Analysis',
    [BookCategory.UTILITIES]: 'Utilities',
    [BookCategory.EDUCATIONAL]: 'Educational',
    [BookCategory.SELF_HELP]: 'Self Help',
    [BookCategory.MISCELLANEOUS]: 'Miscellaneous'
  }
  return categoryNames[category] || category
}

export function FilterPanel({
  filters,
  onFiltersChange,
  availableFilters,
  isOpen,
  onToggle,
  onClearFilters,
  resultCount
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    authors: false,
    languages: false,
    sort: true,
    advanced: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const hasActiveFilters = 
    (filters.categories && filters.categories.length > 0) ||
    (filters.authors && filters.authors.length > 0) ||
    (filters.languages && filters.languages.length > 0) ||
    filters.visibility !== 'all' ||
    filters.hasReadme !== undefined ||
    filters.minStars !== undefined

  const activeFilterCount = [
    filters.categories?.length || 0,
    filters.authors?.length || 0,
    filters.languages?.length || 0,
    filters.visibility !== 'all' ? 1 : 0,
    filters.hasReadme !== undefined ? 1 : 0,
    filters.minStars !== undefined ? 1 : 0
  ].reduce((sum, count) => sum + count, 0)

  return (
    <>
      {/* Filter Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {resultCount !== undefined && (
                  <span className="text-sm text-gray-600">
                    ({resultCount} results)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <FilterSection
              title="Sort by"
              isExpanded={expandedSections.sort}
              onToggle={() => toggleSection('sort')}
            >
              <div className="space-y-2">
                {[
                  { value: 'relevance', label: 'Relevance' },
                  { value: 'date', label: 'Recently Updated' },
                  { value: 'popularity', label: 'Most Popular' },
                  { value: 'alphabetical', label: 'Alphabetical' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={filters.sortBy === option.value}
                      onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Categories */}
            {availableFilters?.availableCategories && availableFilters.availableCategories.length > 0 && (
              <FilterSection
                title="Categories"
                isExpanded={expandedSections.categories}
                onToggle={() => toggleSection('categories')}
                count={filters.categories?.length}
              >
                <CheckboxFilter
                  options={availableFilters.availableCategories.map(getCategoryDisplayName)}
                  selectedValues={filters.categories?.map(getCategoryDisplayName) || []}
                  onChange={(displayNames) => {
                    const categories = displayNames.map(displayName => 
                      Object.values(BookCategory).find(cat => getCategoryDisplayName(cat) === displayName)
                    ).filter(Boolean) as BookCategory[]
                    onFiltersChange({ categories })
                  }}
                />
              </FilterSection>
            )}

            {/* Authors */}
            {availableFilters?.availableAuthors && availableFilters.availableAuthors.length > 0 && (
              <FilterSection
                title="Authors"
                isExpanded={expandedSections.authors}
                onToggle={() => toggleSection('authors')}
                count={filters.authors?.length}
              >
                <CheckboxFilter
                  options={availableFilters.availableAuthors}
                  selectedValues={filters.authors || []}
                  onChange={(authors) => onFiltersChange({ authors })}
                />
              </FilterSection>
            )}

            {/* Languages */}
            {availableFilters?.availableLanguages && availableFilters.availableLanguages.length > 0 && (
              <FilterSection
                title="Programming Languages"
                isExpanded={expandedSections.languages}
                onToggle={() => toggleSection('languages')}
                count={filters.languages?.length}
              >
                <CheckboxFilter
                  options={availableFilters.availableLanguages}
                  selectedValues={filters.languages || []}
                  onChange={(languages) => onFiltersChange({ languages })}
                />
              </FilterSection>
            )}

            {/* Advanced Filters */}
            <FilterSection
              title="Advanced"
              isExpanded={expandedSections.advanced}
              onToggle={() => toggleSection('advanced')}
            >
              <div className="space-y-4">
                {/* Visibility Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <select
                    value={filters.visibility || 'all'}
                    onChange={(e) => onFiltersChange({ visibility: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="all">All repositories</option>
                    <option value="public">Public only</option>
                    <option value="private">Private only</option>
                  </select>
                </div>

                {/* README Filter */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasReadme === true}
                      onChange={(e) => onFiltersChange({ 
                        hasReadme: e.target.checked ? true : undefined 
                      })}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Has README</span>
                  </label>
                </div>

                {/* Minimum Stars Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stars
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minStars || ''}
                    onChange={(e) => onFiltersChange({ 
                      minStars: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </FilterSection>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}