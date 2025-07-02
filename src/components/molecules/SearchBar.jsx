import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ className = '' }) => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions] = useState([
    'music videos',
    'gaming highlights',
    'tutorials',
    'live streams',
    'movie trailers',
    'tech reviews'
  ])
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    const currentQuery = searchParams.get('q')
    if (currentQuery !== query) {
      setQuery(currentQuery || '')
    }
  }, [searchParams])

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase()) && 
    suggestion.toLowerCase() !== query.toLowerCase()
  )

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus-within:shadow-lg focus-within:border-accent">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search videos..."
          className="flex-1 border-none shadow-none rounded-l-full focus:ring-0 bg-transparent"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
        
        <button
          onClick={() => handleSearch()}
          className="p-3 bg-gray-50 hover:bg-gray-100 rounded-r-full border-l border-gray-200 text-gray-600 hover:text-secondary transition-all duration-200"
        >
          <ApperIcon name="Search" size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && (query || filteredSuggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {query && (
              <button
                onClick={() => handleSearch()}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <ApperIcon name="Search" size={16} className="text-gray-400" />
                <span>Search for "<span className="font-medium">{query}</span>"</span>
              </button>
            )}
            
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <ApperIcon name="TrendingUp" size={16} className="text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar