import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No content found",
  message = "It looks like there's nothing here yet.",
  actionLabel = "Browse Videos",
  onAction,
  variant = 'default'
}) => {
  const getEmptyIcon = () => {
    switch (variant) {
      case 'search':
        return 'Search'
      case 'playlist':
        return 'ListVideo'
      case 'history':
        return 'History'
      case 'library':
        return 'BookOpen'
      default:
        return 'Video'
    }
  }

  const getEmptyContent = () => {
    switch (variant) {
      case 'search':
        return {
          title: "No search results",
          message: "Try adjusting your search terms or browse our trending videos instead.",
          actionLabel: "Browse Trending"
        }
      case 'playlist':
        return {
          title: "Playlist is empty",
          message: "Start building your playlist by adding videos you love to watch.",
          actionLabel: "Discover Videos"
        }
      case 'history':
        return {
          title: "No watch history",
          message: "Your recently watched videos will appear here. Start watching to build your history.",
          actionLabel: "Explore Videos"
        }
      case 'library':
        return {
          title: "Library is empty",
          message: "Save videos to your library and create playlists to keep your favorite content organized.",
          actionLabel: "Find Videos"
        }
      default:
        return { title, message, actionLabel }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={getEmptyIcon()} 
            size={48} 
            className="text-accent"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name="Plus" size={16} className="text-white" />
        </div>
      </div>

      <div className="max-w-md">
        <h3 className="text-2xl font-display font-bold text-secondary mb-3">
          {content.title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {content.message}
        </p>

        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            className="inline-flex items-center space-x-2 px-6 py-3"
          >
            <ApperIcon name="Play" size={16} />
            <span>{content.actionLabel}</span>
          </Button>
        )}
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 opacity-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="w-16 h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </motion.div>
  )
}

export default Empty