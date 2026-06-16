import { useState } from 'react'
import axios from 'axios'

export default function Roadmap() {
  const [currentSkills, setCurrentSkills] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = ['software engineer', 'data scientist', 'devops engineer', 'frontend developer']

  const handleGenerate = async () => {
    if (!currentSkills || !targetRole) { setError('Skills සහ Role දෙකම enter කරන්න!'); return }
    setLoading(true); setError('')
    const skillsList = currentSkills.split(',').map(s => s.trim().toLowerCase()).filter(s => s)
    try {
      const res = await axios.post('http://localhost:8000/roadmap/generate', {
        current_skills: skillsList, target_role: targetRole
      })
      setResult(res.data)
    } catch { setError('Backend connect වෙන්න බැහැ!') }
    finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">🗺️ Learning Roadmap</h1>
        <p className="section-subtitle">ඔබේ skill gap identify කරලා personalized learning path හදාගන්න</p>
      </div>

      {/* Form Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label className="label">ඔබ දන්නා Skills</label>
            <input className="input" type="text" placeholder="python, html, css, javascript"
              value={currentSkills} onChange={e => setCurrentSkills(e.target.value)} />
            <p style={{ fontSize: '0.75rem', color: '#5a5a7a', marginTop: '0.4rem' }}>Comma separated</p>
          </div>
          <div>
            <label className="label">Target Role</label>
            <select className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
              <option value="">-- Role select කරන්න --</option>
              {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? '⏳ Generating...' : '🚀 Generate Roadmap'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#4f8ef7' }}>{result.skills_to_learn}</div>
              <div className="stat-label">Skills to Learn</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#8b5cf6', textTransform: 'capitalize', fontSize: '1rem' }}>{result.target_role}</div>
              <div className="stat-label">Target Role</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>
                {result.roadmap.reduce((acc: number, s: any) => acc + s.hours_to_learn, 0)}h
              </div>
              <div className="stat-label">Total Learning Time</div>
            </div>
          </div>

          {result.roadmap.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>All skills learned!</h3>
              <p style={{ color: '#9090b0' }}>ඔබ දැනටමත් target role ට required skills දන්නවා!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.roadmap.map((step: any, i: number) => (
                <div key={i} className="card" style={{
                  display: 'flex', alignItems: 'center', gap: '1.25rem',
                  borderLeft: `3px solid ${step.priority.includes('High') ? '#ef4444' : '#f59e0b'}`
                }}>
                  {/* Number */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: step.priority.includes('High') ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: step.priority.includes('High') ? '#ef4444' : '#f59e0b'
                  }}>
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#f0f0ff', textTransform: 'capitalize', fontSize: '1rem' }}>
                        {step.skill}
                      </span>
                      <span className={`badge ${step.priority.includes('High') ? 'badge-red' : 'badge-amber'}`}>
                        {step.priority}
                      </span>
                      {step.free && <span className="badge badge-green">Free</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#9090b0' }}>
                      ⏱️ {step.hours_to_learn} hours &nbsp;·&nbsp; 📊 Demand: {step.demand_score}
                    </div>
                  </div>

                  {/* Resource */}
                  <a href={step.resource_url} target="_blank" rel="noreferrer"
                    style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                      {step.platform} →
                    </button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}