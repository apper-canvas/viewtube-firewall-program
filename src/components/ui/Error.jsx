import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  variant = 'default' 
}) => {
  const getErrorIcon = () => {
    switch (variant) {
      case 'network':
        return 'WifiOff'
      case 'video':
        return 'PlayCircle'
      case 'search':
        return 'Search'
      default:
        return 'AlertTriangle'
    }
  }

  const getErrorTitle = () => {
    switch (variant) {
      case 'network':
        return 'Connection Error'
      case 'video':
        return 'Video Unavailable'
      case 'search':
        return 'Search Failed'
      default:
        return 'Oops! Something went wrong'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={getErrorIcon()} 
            size={40} 
            className="text-error"
          />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-error rounded-full flex items-center justify-center">
          <ApperIcon name="X" size={12} className="text-white" />
        </div>
      </div>

      <div className="max-w-md">
        <h3 className="text-xl font-display font-semibold text-secondary mb-2">
          {getErrorTitle()}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {showRetry && onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            <span>Try Again</span>
          </Button>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>If the problem persists, please check your connection or try again later.</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Error