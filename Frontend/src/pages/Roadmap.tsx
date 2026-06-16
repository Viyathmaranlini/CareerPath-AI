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

      {/* Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label className="label">ඔබ දන්නා Skills</label>
            <input className="input" type="text" placeholder="python, html, css"
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
        {error && <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}
        <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? '⏳ Generating...' : '🚀 Generate Roadmap'}
        </button>
      </div>

      {result && (
        <div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { value: result.skills_to_learn, label: 'Skills to Learn', color: '#4f8ef7' },
              { value: `${result.total_hours}h`, label: 'Total Time', color: '#8b5cf6' },
              { value: `${result.total_weeks} weeks`, label: 'Study Plan', color: '#f59e0b' },
              { value: `+LKR ${(result.salary_increase/1000).toFixed(0)}k`, label: 'Salary Boost', color: '#10b981' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value" style={{ color: s.color, fontSize: '1.4rem' }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Salary Journey */}
          <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(79,142,247,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#9090b0', marginBottom: '0.25rem' }}>Current Base Salary</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f0ff' }}>
                  LKR {result.base_salary_lkr.toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '2rem', color: '#4f8ef7' }}>→</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', color: '#9090b0', marginBottom: '0.25rem' }}>After Learning All Skills</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                  LKR {result.final_salary_lkr.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap Steps */}
          {result.roadmap.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: '#10b981' }}>All skills learned!</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.roadmap.map((step: any, i: number) => (
                <div key={i} className="card" style={{ borderLeft: `3px solid ${step.difficulty_color}` }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: `${step.difficulty_color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, color: step.difficulty_color, fontSize: '0.9rem'
                      }}>{i + 1}</div>
                      <span style={{ fontWeight: 600, color: '#f0f0ff', fontSize: '1rem', textTransform: 'capitalize' }}>
                        {step.skill}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge" style={{
                        background: `${step.difficulty_color}20`,
                        color: step.difficulty_color,
                        border: `1px solid ${step.difficulty_color}40`
                      }}>{step.difficulty}</span>
                      {step.free && <span className="badge badge-green">Free</span>}
                      {step.extinction_risk === 'declining' && (
                        <span className="badge badge-red">☠️ At Risk</span>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {[
                      { label: '⏱️ Time', value: `${step.hours_to_learn}h` },
                      { label: '📅 Schedule', value: step.week_range },
                      { label: '💰 Salary +', value: `LKR ${(step.salary_boost/1000).toFixed(0)}k` },
                      { label: '☠️ Extinction', value: step.extinction_risk, color: step.extinction_color },
                    ].map((info, j) => (
                      <div key={j} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                        <div style={{ fontSize: '0.72rem', color: '#5a5a7a', marginBottom: '0.2rem' }}>{info.label}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: info.color || '#f0f0ff' }}>{info.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Resources */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={step.resources.youtube} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                        ▶ YouTube
                      </button>
                    </a>
                    <a href={step.resources.coursera} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                        🎓 Coursera
                      </button>
                    </a>
                    <a href={step.resources.github} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                        GitHub
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}