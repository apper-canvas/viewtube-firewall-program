import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-primary/50 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-secondary hover:bg-gray-200 focus:ring-gray-300',
    ghost: 'text-gray-600 hover:text-secondary hover:bg-gray-50 focus:ring-gray-300',
    accent: 'bg-gradient-to-r from-accent to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 focus:ring-accent/50 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-success to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-success/50',
    danger: 'bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-error/50'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button