import { useState } from 'react'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={toggleMobileSidebar}
          showMenuButton={true}
        />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout