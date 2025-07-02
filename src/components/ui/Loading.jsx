import { motion } from 'framer-motion'

const VideoCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="skeleton w-full aspect-video"></div>
    <div className="p-3">
      <div className="skeleton h-4 w-full mb-2 rounded"></div>
      <div className="skeleton h-3 w-3/4 mb-2 rounded"></div>
      <div className="skeleton h-3 w-1/2 rounded"></div>
    </div>
  </div>
)

const VideoGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
    {Array.from({ length: 12 }).map((_, index) => (
      <VideoCardSkeleton key={index} />
    ))}
  </div>
)

const WatchPageSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6 p-4">
    <div className="flex-1">
      <div className="skeleton w-full aspect-video rounded-lg mb-4"></div>
      <div className="skeleton h-6 w-3/4 mb-2 rounded"></div>
      <div className="skeleton h-4 w-1/2 mb-4 rounded"></div>
      <div className="skeleton h-20 w-full rounded"></div>
    </div>
    <div className="w-full lg:w-80">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex gap-3 mb-4">
          <div className="skeleton w-40 aspect-video rounded"></div>
          <div className="flex-1">
            <div className="skeleton h-4 w-full mb-2 rounded"></div>
            <div className="skeleton h-3 w-3/4 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const Loading = ({ variant = 'grid' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
        </div>
      </div>
      
      {variant === 'grid' && <VideoGridSkeleton />}
      {variant === 'watch' && <WatchPageSkeleton />}
    </motion.div>
  )
}

export default Loading