import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoGrid from '@/components/organisms/VideoGrid'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { playlistService } from '@/services/api/playlistService'
import { videoService } from '@/services/api/videoService'
import { toast } from 'react-toastify'

const LibraryPage = () => {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const [watchHistory, setWatchHistory] = useState([])
  const [likedVideos, setLikedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('playlists')

  const tabs = [
    { id: 'playlists', label: 'Playlists', icon: 'ListVideo' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'liked', label: 'Liked Videos', icon: 'Heart' },
    { id: 'watchlater', label: 'Watch Later', icon: 'Clock' }
  ]

  const loadLibraryData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [playlistData, videoData] = await Promise.all([
        playlistService.getAll(),
        videoService.getAll()
      ])
      
      setPlaylists(playlistData)
      
      // Mock watch history and liked videos (in a real app, these would come from user data)
      const mockHistory = videoData.slice(0, 5)
      const mockLiked = videoData.slice(2, 7)
      
      setWatchHistory(mockHistory)
      setLikedVideos(mockLiked)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLibraryData()
  }, [])

  const handleCreatePlaylist = () => {
    const newPlaylist = {
      name: `My Playlist ${playlists.length + 1}`,
      videoIds: [],
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
      videoCount: 0
    }
    
    playlistService.create(newPlaylist).then((created) => {
      setPlaylists([...playlists, created])
      toast.success('Playlist created successfully!')
    })
  }

  const handleDeletePlaylist = (playlistId) => {
    playlistService.delete(playlistId).then(() => {
      setPlaylists(playlists.filter(p => p.Id !== playlistId))
      toast.success('Playlist deleted successfully!')
    })
  }

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
        onRetry={loadLibraryData}
        variant="default"
      />
    )
  }

  const renderPlaylists = () => {
    if (playlists.length === 0) {
      return (
        <Empty
          title="No playlists yet"
          message="Create your first playlist to organize your favorite videos."
          actionLabel="Create Playlist"
          onAction={handleCreatePlaylist}
          variant="playlist"
        />
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <motion.div
            key={playlist.Id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
          >
            <div className="relative aspect-video">
              <img
                src={playlist.thumbnail}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ApperIcon name="Play" size={32} className="text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {playlist.videoCount} videos
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-secondary line-clamp-1 mb-1">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {playlist.videoCount} videos
                  </p>
                </div>
                <IconButton
                  icon="Trash2"
                  variant="ghost"
                  size="small"
                  onClick={() => handleDeletePlaylist(playlist.Id)}
                  className="text-red-500 hover:text-red-600"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  const renderHistory = () => {
    if (watchHistory.length === 0) {
      return (
        <Empty
          title="No watch history"
          message="Your recently watched videos will appear here."
          actionLabel="Start Watching"
          onAction={handleBrowseVideos}
          variant="history"
        />
      )
    }

    return <VideoGrid videos={watchHistory} />
  }

  const renderLikedVideos = () => {
    if (likedVideos.length === 0) {
      return (
        <Empty
          title="No liked videos"
          message="Videos you like will appear here."
          actionLabel="Find Videos"
          onAction={handleBrowseVideos}
          variant="library"
        />
      )
    }

    return <VideoGrid videos={likedVideos} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return renderPlaylists()
      case 'history':
        return renderHistory()
      case 'liked':
        return renderLikedVideos()
      case 'watchlater':
        return (
          <Empty
            title="Watch Later is empty"
            message="Save videos to watch later and they'll appear here."
            actionLabel="Browse Videos"
            onAction={handleBrowseVideos}
            variant="library"
          />
        )
      default:
        return renderPlaylists()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary mb-2">
                Your Library
              </h1>
              <p className="text-gray-600">
                Manage your playlists, history, and saved videos
              </p>
            </div>
            
            {activeTab === 'playlists' && (
              <Button
                variant="primary"
                onClick={handleCreatePlaylist}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Create Playlist</span>
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LibraryPage