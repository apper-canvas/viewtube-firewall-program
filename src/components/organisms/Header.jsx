import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import IconButton from '@/components/atoms/IconButton'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick, showMenuButton = false }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <motion.header 
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm"
    >
      <div className="flex items-center space-x-4">
        {showMenuButton && (
          <IconButton
            icon="Menu"
            variant="ghost"
            onClick={onMenuClick}
            className="lg:hidden"
          />
        )}
        
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Play" size={20} className="text-white" />
          </div>
          <span className="text-xl font-display font-bold text-secondary hidden sm:block">
            ViewTube
          </span>
        </Link>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:block flex-1 max-w-2xl mx-8">
        <SearchBar />
      </div>

      {/* Mobile Search Toggle */}
      <div className="md:hidden">
        <IconButton
          icon="Search"
          variant="ghost"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <IconButton
          icon="Bell"
          variant="ghost"
        />
        <IconButton
          icon="User"
          variant="ghost"
        />
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden"
        >
          <SearchBar />
        </motion.div>
      )}
    </motion.header>
  )
}

export default Header