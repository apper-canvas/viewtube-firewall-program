import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoGrid from '@/components/organisms/VideoGrid'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { channelService } from '@/services/api/channelService'
import { videoService } from '@/services/api/videoService'
import { toast } from 'react-toastify'

const ChannelPage = () => {
  const { channelId } = useParams()
  const navigate = useNavigate()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [activeTab, setActiveTab] = useState('videos')

  const tabs = [
    { id: 'videos', label: 'Videos', icon: 'Video' },
    { id: 'playlists', label: 'Playlists', icon: 'ListVideo' },
    { id: 'about', label: 'About', icon: 'Info' }
  ]

  const loadChannelData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const channelData = await channelService.getById(channelId)
      setChannel(channelData)
      
      const allVideos = await videoService.getAll()
      const channelVideos = allVideos.filter(video => video.channelId === channelId)
      setVideos(channelVideos)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (channelId) {
      loadChannelData()
    }
  }, [channelId])

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
    toast.success(isSubscribed ? 'Unsubscribed successfully!' : 'Subscribed successfully!')
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
        onRetry={loadChannelData}
        variant="default"
      />
    )
  }

  if (!channel) {
    return (
      <Error
        message="Channel not found"
        onRetry={() => navigate('/')}
        variant="default"
      />
    )
  }

  const renderVideos = () => {
    if (videos.length === 0) {
      return (
        <Empty
          title="No videos uploaded"
          message="This channel hasn't uploaded any videos yet."
          actionLabel="Browse Other Videos"
          onAction={handleBrowseVideos}
          variant="default"
        />
      )
    }

    return <VideoGrid videos={videos} />
  }

  const renderPlaylists = () => {
    return (
      <Empty
        title="No playlists"
        message="This channel hasn't created any public playlists yet."
        actionLabel="View Videos"
        onAction={() => setActiveTab('videos')}
        variant="playlist"
      />
    )
  }

  const renderAbout = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 max-w-4xl"
      >
        <h3 className="text-xl font-display font-bold text-secondary mb-4">About {channel.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-secondary mb-2">Channel Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subscribers:</span>
                <span className="font-medium">{formatNumber(channel.subscribers)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Videos:</span>
                <span className="font-medium">{videos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Views:</span>
                <span className="font-medium">{formatNumber(videos.reduce((sum, video) => sum + video.views, 0))}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-secondary mb-2">Channel Info</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome to {channel.name}! This channel is dedicated to bringing you high-quality video content. 
              Subscribe to stay updated with our latest uploads and join our growing community.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        return renderVideos()
      case 'playlists':
        return renderPlaylists()
      case 'about':
        return renderAbout()
      default:
        return renderVideos()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Channel Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 to-accent/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              src={channel.avatar}
              alt={channel.name}
              className="w-32 h-32 rounded-full shadow-lg border-4 border-white"
            />
            
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-display font-bold text-secondary mb-2"
              >
                {channel.name}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-4 text-gray-600 mb-4"
              >
                <span>{formatNumber(channel.subscribers)} subscribers</span>
                <span>•</span>
                <span>{videos.length} videos</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-3"
              >
                <Button
                  variant={isSubscribed ? 'secondary' : 'primary'}
                  onClick={handleSubscribe}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name={isSubscribed ? 'Check' : 'UserPlus'} size={16} />
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </Button>
                
                <IconButton
                  icon="Bell"
                  variant="secondary"
                />
                
                <IconButton
                  icon="Share"
                  variant="secondary"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white border-b border-gray-200 sticky top-16 z-30"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
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

export default ChannelPage