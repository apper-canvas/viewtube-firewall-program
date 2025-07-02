import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SidebarNav = ({ collapsed = false }) => {
  const navItems = [
    { to: '/', label: 'Home', icon: 'Home' },
    { to: '/trending', label: 'Trending', icon: 'TrendingUp' },
    { to: '/library', label: 'Library', icon: 'BookOpen' },
    { to: '/history', label: 'History', icon: 'History' },
  ]

  return (
    <nav className="py-4">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 rounded-lg mx-2 ${
                  isActive ? 'bg-primary/10 text-primary font-medium' : ''
                } ${collapsed ? 'justify-center' : 'space-x-3'}`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? 'text-primary' : 'text-gray-600'} 
                  />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SidebarNav