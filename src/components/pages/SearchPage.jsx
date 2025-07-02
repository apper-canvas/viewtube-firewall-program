import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoGrid from '@/components/organisms/VideoGrid'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { videoService } from '@/services/api/videoService'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [filterBy, setFilterBy] = useState('all')

  const query = searchParams.get('q') || ''

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: 'Target' },
    { value: 'date', label: 'Upload Date', icon: 'Calendar' },
    { value: 'views', label: 'View Count', icon: 'Eye' },
    { value: 'rating', label: 'Rating', icon: 'Star' }
  ]

  const filterOptions = [
    { value: 'all', label: 'All', icon: 'Grid3X3' },
    { value: 'video', label: 'Videos', icon: 'Video' },
    { value: 'channel', label: 'Channels', icon: 'Users' },
    { value: 'playlist', label: 'Playlists', icon: 'ListVideo' }
  ]

  const loadVideos = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await videoService.getAll()
      setVideos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVideos()
  }, [])

  useEffect(() => {
    if (videos.length > 0) {
      let filtered = [...videos]

      // Search filter
      if (query) {
        filtered = filtered.filter(video =>
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.description.toLowerCase().includes(query.toLowerCase()) ||
          video.channelName.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Sort
      switch (sortBy) {
        case 'date':
          filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
          break
        case 'views':
          filtered.sort((a, b) => b.views - a.views)
          break
        case 'rating':
          filtered.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes))
          break
        default:
          // Relevance - keep original order or implement relevance scoring
          break
      }

      setFilteredVideos(filtered)
    }
  }, [videos, query, sortBy, filterBy])

  const handleBrowseVideos = () => {
    navigate('/')
  }

  if (loading) {
    return <Loading variant="grid" />
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadVideos}
        variant="search"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <SearchBar className="max-w-2xl" />
          </div>
          
          {query && (
            <div className="mb-4">
              <h1 className="text-2xl font-display font-bold text-secondary mb-2">
                Search results for "{query}"
              </h1>
              <p className="text-gray-600">
                {filteredVideos.length} results found
              </p>
            </div>
          )}

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex space-x-1">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? 'primary' : 'ghost'}
                    size="small"
                    onClick={() => setSortBy(option.value)}
                    className="flex items-center space-x-1"
                  >
                    <ApperIcon name={option.icon} size={14} />
                    <span>{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex space-x-1">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filterBy === option.value ? 'accent' : 'ghost'}
                    size="small"
                    onClick={() => setFilterBy(option.value)}
                    className="flex items-center space-x-1"
                  >
                    <ApperIcon name={option.icon} size={14} />
                    <span>{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Results */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {!query ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Search" size={48} className="text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-secondary mb-4">
                Search for videos
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Enter a search term above to find videos, channels, and playlists.
              </p>
              <Button
                variant="primary"
                onClick={handleBrowseVideos}
                className="inline-flex items-center space-x-2"
              >
                <ApperIcon name="Home" size={16} />
                <span>Browse Home</span>
              </Button>
            </motion.div>
          ) : filteredVideos.length === 0 ? (
            <Empty
              title="No search results"
              message={`We couldn't find any videos matching "${query}". Try different keywords or browse our trending videos.`}
              actionLabel="Browse Trending"
              onAction={handleBrowseVideos}
              variant="search"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <VideoGrid videos={filteredVideos} />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default SearchPage