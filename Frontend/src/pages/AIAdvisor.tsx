import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function AIAdvisor() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', degree: '', university: '',
    skills: '', experience_years: 0,
    target_role: '', goal: ''
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const universities = ['SLIIT', 'UOM', 'UCSC', 'NSBM', 'IIT', 'Informatics', 'APIIT', 'Wayamba', 'Kelaniya', 'Other']
  const roles = ['software engineer', 'data scientist', 'devops engineer', 'frontend developer', 'ml engineer']

  const handleSubmit = async () => {
    if (!form.name || !form.degree || !form.target_role) { setError('සියලු fields fill කරන්න!'); return }
    setLoading(true); setError('')
    try {
      const res = await axios.post('http://localhost:8000/ai/career-advice', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim().toLowerCase()),
        experience_years: Number(form.experience_years)
      })
      setResult(res.data)
    } catch { setError('AI service connect වෙන්න බැහැ!') }
    finally { setLoading(false) }
  }

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }))

  return (
    <div className="page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">🤖 AI Career Advisor</h1>
        <p className="section-subtitle">ඔබේ profile analyze කරලා Sri Lanka IT market based personalized career advice ගන්න</p>
      </div>

      {!result ? (
        <div style={{ maxWidth: '680px' }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px',
                background: step >= s ? 'linear-gradient(90deg, #4f8ef7, #8b5cf6)' : '#2a2a3a',
                transition: 'background 0.3s' }} />
            ))}
          </div>

          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div className="card">
              <h3 style={{ color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem' }}>
                👤 Step 1 — Personal Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label">ඔබේ නම</label>
                  <input className="input" placeholder="Viyathmaranlini"
                    value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div>
                  <label className="label">Degree / Qualification</label>
                  <input className="input" placeholder="BSc Computer Science"
                    value={form.degree} onChange={e => update('degree', e.target.value)} />
                </div>
                <div>
                  <label className="label">University / Institute</label>
                  <select className="input" value={form.university} onChange={e => update('university', e.target.value)}>
                    <option value="">-- Select කරන්න --</option>
                    {universities.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}
                onClick={() => { if (!form.name || !form.degree) { setError('Name සහ Degree fill කරන්න!'); return } setError(''); setStep(2) }}>
                Continue →
              </button>
              {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}
            </div>
          )}

          {/* Step 2 — Skills */}
          {step === 2 && (
            <div className="card">
              <h3 style={{ color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem' }}>
                💻 Step 2 — Skills & Experience
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label">ඔබේ Current Skills</label>
                  <input className="input" placeholder="python, react, sql, docker"
                    value={form.skills} onChange={e => update('skills', e.target.value)} />
                  <p style={{ fontSize: '0.75rem', color: '#5a5a7a', marginTop: '0.4rem' }}>Comma separated</p>
                </div>
                <div>
                  <label className="label">Experience (Years)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[0, 1, 2, 3, 5, 7, 10].map(y => (
                      <button key={y} onClick={() => update('experience_years', y)}
                        style={{
                          padding: '8px 16px', borderRadius: '8px', border: '1px solid',
                          borderColor: form.experience_years === y ? '#4f8ef7' : '#2a2a3a',
                          background: form.experience_years === y ? 'rgba(79,142,247,0.15)' : 'transparent',
                          color: form.experience_years === y ? '#4f8ef7' : '#9090b0',
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem', fontWeight: 500
                        }}>
                        {y === 0 ? 'Fresher' : `${y}yr`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={() => { setError(''); setStep(3) }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Goal */}
          {step === 3 && (
            <div className="card">
              <h3 style={{ color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem' }}>
                🎯 Step 3 — Target & Goal
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label">Target Role</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {roles.map(r => (
                      <button key={r} onClick={() => update('target_role', r)}
                        style={{
                          padding: '8px 14px', borderRadius: '8px', border: '1px solid',
                          borderColor: form.target_role === r ? '#8b5cf6' : '#2a2a3a',
                          background: form.target_role === r ? 'rgba(139,92,246,0.15)' : 'transparent',
                          color: form.target_role === r ? '#8b5cf6' : '#9090b0',
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize'
                        }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">ඔබේ Goal</label>
                  <textarea className="input" placeholder="6 months වල Sri Lanka IT job එකක් ගන්න..."
                    value={form.goal} onChange={e => update('goal', e.target.value)}
                    rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={loading}>
                  {loading ? '🤖 AI Analyzing...' : '🚀 Get AI Career Advice'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Result Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: '#f0f0ff', fontSize: '1.25rem', fontWeight: 600 }}>
                🤖 AI Career Analysis for {form.name}
              </h2>
              <p style={{ color: '#9090b0', fontSize: '0.875rem' }}>
                {form.university} · {form.degree} · {form.experience_years === 0 ? 'Fresher' : `${form.experience_years}yr exp`}
              </p>
            </div>
            <button className="btn-secondary" onClick={() => { setResult(null); setStep(1) }}>
              ← Start Over
            </button>
          </div>

          {/* AI Advice */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.875rem', lineHeight: '1.8', color: '#d0d0e8',
            }}>
              <ReactMarkdown>{result.advice}</ReactMarkdown>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>{result.roadmap_steps}</div>
              <div className="stat-label">Skills to Learn</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#4f8ef7', textTransform: 'capitalize', fontSize: '1rem' }}>
                {form.target_role}
              </div>
              <div className="stat-label">Target Role</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}