import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'
import { useAuth } from '../AuthContext'
import { Language } from '../i18n'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()
  const { user, logout, isAuthenticated } = useAuth()

  const links = [
    { path: '/', label: t('nav_home') },
    { path: '/trending', label: t('nav_trending') },
    { path: '/roadmap', label: t('nav_roadmap') },
    { path: '/ai-advisor', label: t('nav_ai_advisor') },
    { path: '/extinction', label: t('nav_skill_extinction') },
  ]

  const languages: { code: Language; flag: string; label: string }[] = [
    { code: 'en', flag: '🇬🇧', label: 'EN' },
    { code: 'si', flag: '🇱🇰', label: 'සිං' },
    { code: 'ta', flag: '🇱🇰', label: 'தமி' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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
      gap: '1.25rem'
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
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: location.pathname === link.path ? '#f0f0ff' : '#9090b0',
            background: location.pathname === link.path ? '#2a2a3a' : 'transparent',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Language Switcher */}
      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
        {languages.map(lang => (
          <button key={lang.code} onClick={() => setLanguage(lang.code)}
            style={{
              padding: '5px 10px', borderRadius: '8px',
              border: '1px solid',
              borderColor: language === lang.code ? '#4f8ef7' : '#2a2a3a',
              background: language === lang.code ? 'rgba(79,142,247,0.15)' : 'transparent',
              color: language === lang.code ? '#4f8ef7' : '#9090b0',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '0.78rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'all 0.2s'
            }}>
            {lang.flag} {lang.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#2a2a3a', flexShrink: 0 }} />

      {/* Auth Section */}
      {isAuthenticated ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <Link to="/saved-roadmaps" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </Link>
          <span style={{ color: '#9090b0', fontSize: '0.82rem' }}>{user?.name}</span>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              Login
            </button>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  )
}