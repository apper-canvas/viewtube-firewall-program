import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoGrid from '@/components/organisms/VideoGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { videoService } from '@/services/api/videoService'

const HomePage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  const categories = [
    { id: 'all', label: 'All', icon: 'Grid3X3' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'music', label: 'Music', icon: 'Music' },
    { id: 'gaming', label: 'Gaming', icon: 'Gamepad2' },
    { id: 'news', label: 'News', icon: 'Newspaper' },
    { id: 'sports', label: 'Sports', icon: 'Trophy' },
    { id: 'entertainment', label: 'Entertainment', icon: 'Tv' },
    { id: 'education', label: 'Education', icon: 'GraduationCap' }
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

  const handleBrowseVideos = () => {
    navigate('/search?q=trending')
  }

  if (loading) {
    return <Loading variant="grid" />
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadVideos}
        variant="network"
      />
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <Empty
        title="No videos available"
        message="Check back later for new content, or explore our trending videos."
        actionLabel="Browse Trending"
        onAction={handleBrowseVideos}
        variant="default"
      />
    )
  }

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => 
        video.title.toLowerCase().includes(selectedCategory) ||
        video.description.toLowerCase().includes(selectedCategory)
      )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 via-accent/5 to-purple-500/5 px-6 py-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-secondary mb-4"
          >
            Discover Amazing
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Videos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Explore millions of videos from creators around the world. Find something new to watch right now.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="primary"
              className="px-8 py-3 text-lg"
              onClick={() => navigate('/search')}
            >
              <ApperIcon name="Search" size={20} className="mr-2" />
              Start Exploring
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6 py-8 border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <ApperIcon name={category.icon} size={16} />
                <span>{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Video Grid */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-display font-bold text-secondary mb-2">
              {selectedCategory === 'all' ? 'Recommended for You' : `${categories.find(c => c.id === selectedCategory)?.label} Videos`}
            </h2>
            <p className="text-gray-600">
              {filteredVideos.length} videos available
            </p>
          </motion.div>

          {filteredVideos.length === 0 ? (
            <Empty
              title={`No ${selectedCategory} videos found`}
              message="Try selecting a different category or check back later for new content."
              actionLabel="View All Videos"
              onAction={() => setSelectedCategory('all')}
              variant="search"
            />
          ) : (
            <VideoGrid videos={filteredVideos} />
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage