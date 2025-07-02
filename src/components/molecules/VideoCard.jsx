import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const VideoCard = ({ video, showChannel = true, size = 'default' }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  const cardSizes = {
    small: 'w-full max-w-xs',
    default: 'w-full',
    large: 'w-full max-w-sm'
  }

  const thumbnailSizes = {
    small: 'aspect-[16/9]',
    default: 'aspect-video',
    large: 'aspect-[16/9]'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${cardSizes[size]} bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer`}
    >
      <Link to={`/watch/${video.Id}`} className="block">
        <div className={`relative ${thumbnailSizes[size]} overflow-hidden`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
          
          {/* Hover play button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ApperIcon name="Play" size={20} className="text-secondary ml-1" />
            </motion.div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-secondary line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          
          {showChannel && (
            <p className="text-sm text-gray-600 mb-1">{video.channelName}</p>
          )}
          
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <span>{formatViews(video.views)}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(video.uploadDate), { addSuffix: true })}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default VideoCard