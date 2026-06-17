import { Link } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'

export default function Home() {
  const { t } = useLanguage()

  const features = [
    {
      icon: '📊',
      title: 'Job Market Analysis',
      desc: 'Real-time Sri Lanka IT job postings analyze කරනවා — ikman.lk, TopJobs.lk data',
      color: '#4f8ef7',
      link: '/trending'
    },
    {
      icon: '☠️',
      title: 'Skill Extinction Predictor',
      desc: '2028 වෙද්දී මොන skills die වෙනවාද? Historical data + ML forecasting',
      color: '#ef4444',
      link: '/extinction'
    },
    {
      icon: '🤖',
      title: 'AI Career Advisor',
      desc: 'ඔබේ profile analyze කරලා Sri Lanka market based personalized advice',
      color: '#8b5cf6',
      link: '/ai-advisor'
    },
    {
      icon: '🗺️',
      title: 'Learning Roadmap',
      desc: 'Skill gap identify කරලා free resources සහිත step-by-step roadmap',
      color: '#10b981',
      link: '/roadmap'
    },
  ]

  const stats = [
    { value: '9,600+', label: t('home_stats_jobs') },
    { value: '50+', label: t('home_stats_skills') },
    { value: '2028', label: t('home_stats_forecast') },
    { value: '100%', label: t('home_stats_free') },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '5rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '25%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', color: '#4f8ef7', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          {t('home_badge')}
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#f0f0ff' }}>
          {t('home_title_1')}<br />
          <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {t('home_title_2')}
          </span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#9090b0', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          {t('home_subtitle')}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/ai-advisor" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              {t('home_btn_ai')}
            </button>
          </Link>
          <Link to="/extinction" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              {t('home_btn_extinction')}
            </button>
          </Link>
        </div>
      </div>

      {/* Stats + Features */}
      <div style={{ padding: '0 2rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value" style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f0ff', marginBottom: '0.5rem' }}>
            {t('home_features_title')}
          </h2>
          <p style={{ color: '#9090b0', fontSize: '0.95rem' }}>{t('home_features_subtitle')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {features.map((f, i) => (
            <Link key={i} to={f.link} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f0f0ff', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#9090b0', lineHeight: 1.6 }}>{f.desc}</p>
                <div style={{ marginTop: '1rem', color: f.color, fontSize: '0.82rem', fontWeight: 600 }}>Explore →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(79,142,247,0.2)', borderRadius: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f0f0ff', marginBottom: '0.75rem' }}>
            {t('home_cta_title')}
          </h3>
          <p style={{ color: '#9090b0', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {t('home_cta_subtitle')}
          </p>
          <Link to="/ai-advisor" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
              {t('home_cta_btn')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}