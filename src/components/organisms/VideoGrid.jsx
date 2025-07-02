import { motion } from 'framer-motion'
import VideoCard from '@/components/molecules/VideoCard'

const VideoGrid = ({ videos, loading = false, className = '' }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="skeleton w-full aspect-video"></div>
            <div className="p-3">
              <div className="skeleton h-4 w-full mb-2 rounded"></div>
              <div className="skeleton h-3 w-3/4 mb-2 rounded"></div>
              <div className="skeleton h-3 w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
    >
      {videos?.map((video) => (
        <motion.div key={video.Id} variants={item}>
          <VideoCard video={video} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default VideoGrid