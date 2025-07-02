import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import HomePage from '@/components/pages/HomePage'
import WatchPage from '@/components/pages/WatchPage'
import SearchPage from '@/components/pages/SearchPage'
import LibraryPage from '@/components/pages/LibraryPage'
import ChannelPage from '@/components/pages/ChannelPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-body">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:videoId" element={<WatchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/channel/:channelId" element={<ChannelPage />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </Router>
  )
}

export default App