import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import VideoPlayer from '@/components/organisms/VideoPlayer'
import VideoCard from '@/components/molecules/VideoCard'
import Button from '@/components/atoms/Button'
import IconButton from '@/components/atoms/IconButton'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { videoService } from '@/services/api/videoService'
import { channelService } from '@/services/api/channelService'
import { toast } from 'react-toastify'

const WatchPage = () => {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [channel, setChannel] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  const loadVideoData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const videoData = await videoService.getById(parseInt(videoId))
      setVideo(videoData)
      
      if (videoData.channelId) {
        const channelData = await channelService.getById(videoData.channelId)
        setChannel(channelData)
      }
      
      const allVideos = await videoService.getAll()
      const related = allVideos
        .filter(v => v.Id !== parseInt(videoId))
        .slice(0, 10)
      setRelatedVideos(related)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (videoId) {
      loadVideoData()
    }
  }, [videoId])

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
    toast.success(isLiked ? 'Removed from liked videos' : 'Added to liked videos')
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleSave = () => {
    toast.success('Video saved to Watch Later')
  }

  if (loading) {
    return <Loading variant="watch" />
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadVideoData}
        variant="video"
      />
    )
  }

  if (!video) {
    return (
      <Error
        message="Video not found"
        onRetry={() => navigate('/')}
        variant="video"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-video mb-6"
            >
              <VideoPlayer video={video} autoplay={true} className="w-full h-full" />
            </motion.div>

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <h1 className="text-2xl font-display font-bold text-secondary mb-3">
                {video.title}
              </h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{formatViews(video.views)}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(video.uploadDate), { addSuffix: true })}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                    <IconButton
                      icon="ThumbsUp"
                      variant="ghost"
                      active={isLiked}
                      onClick={handleLike}
                      className="rounded-none"
                    />
                    <span className="px-2 text-sm text-gray-600">
                      {formatNumber(video.likes + (isLiked ? 1 : 0))}
                    </span>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <IconButton
                      icon="ThumbsDown"
                      variant="ghost"
                      active={isDisliked}
                      onClick={handleDislike}
                      className="rounded-none"
                    />
                  </div>
                  
                  <IconButton
                    icon="Share"
                    variant="secondary"
                    onClick={handleShare}
                  />
                  
                  <IconButton
                    icon="Download"
                    variant="secondary"
                  />
                  
                  <IconButton
                    icon="Bookmark"
                    variant="secondary"
                    onClick={handleSave}
                  />
                </div>
              </div>

              {/* Channel Info */}
              {channel && (
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-secondary">{channel.name}</h3>
                      <p className="text-sm text-gray-600">{formatNumber(channel.subscribers)} subscribers</p>
                    </div>
                  </div>
                  <Button variant="primary">
                    Subscribe
                  </Button>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-gray-200 pt-4">
                <div className={`text-gray-700 ${showDescription ? '' : 'line-clamp-3'}`}>
                  {video.description}
                </div>
                {video.description.length > 200 && (
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="text-accent hover:text-blue-600 font-medium mt-2"
                  >
                    {showDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-96"
          >
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-secondary mb-4 flex items-center">
                <ApperIcon name="PlayCircle" size={20} className="mr-2" />
                Up Next
              </h3>
              
              <div className="space-y-3">
                {relatedVideos.map((relatedVideo) => (
                  <div key={relatedVideo.Id} className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="relative flex-shrink-0">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-40 aspect-video object-cover rounded cursor-pointer"
                        onClick={() => navigate(`/watch/${relatedVideo.Id}`)}
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {Math.floor(relatedVideo.duration / 60)}:{(relatedVideo.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-medium text-sm text-secondary line-clamp-2 cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/watch/${relatedVideo.Id}`)}
                      >
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{relatedVideo.channelName}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-1">
                        <span>{formatViews(relatedVideo.views)}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(relatedVideo.uploadDate), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

export default WatchPage