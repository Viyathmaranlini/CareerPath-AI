import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      background: '#1e293b',
      padding: '1rem 2rem',
      display: 'flex',
      gap: '2rem',
      alignItems: 'center'
    }}>
      <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem' }}>
        🎓 CareerPath AI
      </span>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/trending" style={{ color: 'white', textDecoration: 'none' }}>Trending Skills</Link>
      <Link to="/roadmap" style={{ color: 'white', textDecoration: 'none' }}>My Roadmap</Link>
      <Link to="/ai-advisor" style={{ color: 'white', textDecoration: 'none' }}>🤖 AI Advisor</Link>
    </nav>
  )
}