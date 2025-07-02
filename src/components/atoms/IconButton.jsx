import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const IconButton = forwardRef(({ 
  icon, 
  variant = 'ghost', 
  size = 'medium',
  active = false,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    ghost: `text-gray-600 hover:text-secondary hover:bg-gray-100 focus:ring-gray-300 ${active ? 'text-primary bg-primary/10' : ''}`,
    primary: `bg-primary text-white hover:bg-red-600 focus:ring-primary/50 shadow-md hover:shadow-lg ${active ? 'bg-red-600' : ''}`,
    secondary: `bg-gray-100 text-secondary hover:bg-gray-200 focus:ring-gray-300 ${active ? 'bg-gray-200' : ''}`,
    glass: `glass-dark text-white hover:bg-white/20 focus:ring-white/50 ${active ? 'bg-white/30' : ''}`
  }
  
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  }
  
  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={classes}
      disabled={disabled}
      {...props}
    >
      <ApperIcon name={icon} size={iconSizes[size]} />
    </motion.button>
  )
})

IconButton.displayName = 'IconButton'

export default IconButton