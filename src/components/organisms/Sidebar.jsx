import { motion, AnimatePresence } from 'framer-motion'
import SidebarNav from '@/components/molecules/SidebarNav'
import IconButton from '@/components/atoms/IconButton'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 240 }}
        className="hidden lg:block bg-white border-r border-gray-200 h-full overflow-y-auto"
      >
        <div className="p-4 border-b border-gray-200">
          <IconButton
            icon="Menu"
            variant="ghost"
            onClick={onToggle}
            className="mb-4"
          />
        </div>
        <SidebarNav collapsed={collapsed} />
        
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-6 border-t border-gray-200 mt-6"
          >
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Access</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2">
                <ApperIcon name="Clock" size={16} />
                <span>Watch Later</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2">
                <ApperIcon name="Heart" size={16} />
                <span>Liked Videos</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2">
                <ApperIcon name="Download" size={16} />
                <span>Downloads</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 w-70 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Play" size={20} className="text-white" />
                  </div>
                  <span className="text-xl font-display font-bold text-secondary">
                    ViewTube
                  </span>
                </div>
                <IconButton
                  icon="X"
                  variant="ghost"
                  onClick={onMobileClose}
                />
              </div>
              <SidebarNav />
              
              <div className="px-4 py-6 border-t border-gray-200 mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Access</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2">
                    <ApperIcon name="Clock" size={16} />
                    <span>Watch Later</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2">
                    <ApperIcon name="Heart" size={16} />
                    <span>Liked Videos</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2">
                    <ApperIcon name="Download" size={16} />
                    <span>Downloads</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar