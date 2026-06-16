import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  
  const links = [
    { path: '/', label: 'Home' },
    { path: '/trending', label: 'Trending' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/ai-advisor', label: 'AI Advisor' },
    { path: '/extinction', label: 'Skill Extinction' },
  ]

  return (
    <nav style={{
      background: 'rgba(10,10,15,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #2a2a3a',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      height: '64px',
      gap: '2rem'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px'
        }}>🎓</div>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f0f0ff', letterSpacing: '-0.02em' }}>
          CareerPath <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
        {links.map(link => (
          <Link key={link.path} to={link.path} style={{
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: location.pathname === link.path ? '#f0f0ff' : '#9090b0',
            background: location.pathname === link.path ? '#2a2a3a' : 'transparent',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            if (location.pathname !== link.path)
              (e.target as HTMLElement).style.color = '#f0f0ff'
          }}
          onMouseLeave={e => {
            if (location.pathname !== link.path)
              (e.target as HTMLElement).style.color = '#9090b0'
          }}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Badge */}
      <div style={{
        padding: '6px 14px', borderRadius: '20px',
        background: 'rgba(79,142,247,0.1)',
        border: '1px solid rgba(79,142,247,0.3)',
        color: '#4f8ef7', fontSize: '0.8rem', fontWeight: 600,
        flexShrink: 0
      }}>
        🇱🇰 Sri Lanka
      </div>
    </nav>
  )
}