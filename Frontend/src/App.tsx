import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TrendingSkills from './pages/TrendingSkills'
import Roadmap from './pages/Roadmap'
import AIAdvisor from './pages/AIAdvisor'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<TrendingSkills />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/ai-advisor" element={<AIAdvisor />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
