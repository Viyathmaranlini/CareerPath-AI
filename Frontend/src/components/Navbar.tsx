import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'
import { Language } from '../i18n'

export default function Navbar() {
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

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
      gap: '1.5rem'
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
    </nav>
  )
}