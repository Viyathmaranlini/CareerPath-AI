export default function Home() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '1rem' }}>
          🎓 CareerPath AI
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>
          ඔබේ future career smart ව plan කරන්න — real job data ඇතුළව!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/trending" style={{
            background: '#3b82f6', color: 'white',
            padding: '0.75rem 2rem', borderRadius: '8px',
            textDecoration: 'none', fontWeight: 'bold'
          }}>
            🔥 Trending Skills
          </a>
          <a href="/roadmap" style={{
            background: '#10b981', color: 'white',
            padding: '0.75rem 2rem', borderRadius: '8px',
            textDecoration: 'none', fontWeight: 'bold'
          }}>
            🗺️ My Roadmap
          </a>
        </div>
      </div>

      {/* Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem'
      }}>
        {[
          { icon: '📊', title: 'Job Data Analysis', desc: 'Thousands of job postings analyze කරනවා' },
          { icon: '🔍', title: 'Skill Detection', desc: 'Emerging skills automatically detect කරනවා' },
          { icon: '🗺️', title: 'Personal Roadmap', desc: 'ඔබටම personalized learning path' },
        ].map((f, i) => (
          <div key={i} style={{
            background: 'white', padding: '1.5rem',
            borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
            <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{f.title}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}