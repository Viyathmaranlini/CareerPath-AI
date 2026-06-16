import { useState } from 'react'
import axios from 'axios'

export default function Roadmap() {
  const [currentSkills, setCurrentSkills] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = ['software engineer','data scientist','devops engineer','frontend developer']

  const handleGenerate = async () => {
    if (!currentSkills || !targetRole) { setError('Skills සහ Role දෙකම enter කරන්න!'); return }
    setLoading(true); setError('')
    const skillsList = currentSkills.split(',').map((s) => s.trim().toLowerCase()).filter((s) => s)
    try {
      const res = await axios.post('http://localhost:8000/roadmap/generate', { current_skills: skillsList, target_role: targetRole })
      setResult(res.data)
    } catch { setError('Backend connect වෙන්න බැහැ!') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b' }}>My Learning Roadmap</h2>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ඔබ දන්නා Skills (comma separated)</label>
          <input type="text" placeholder="python, html, css" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Role</label>
          <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', background: 'white' }}>
            <option value="">-- Role select කරන්න --</option>
            {roles.map((r) => (<option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>))}
          </select>
        </div>
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        <button onClick={handleGenerate} disabled={loading}
          style={{ background: '#3b82f6', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </div>
      {result && (
        <div>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
            <strong>Target:</strong> {result.target_role} | <strong>Skills to learn:</strong> {result.skills_to_learn}
          </div>
          {result.roadmap.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>You already know all required skills!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.roadmap.map((step: any, i: number) => (
                <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #3b82f6' }}>
                  <h3 style={{ margin: '0 0 0.5rem', textTransform: 'capitalize' }}>{i + 1}. {step.skill}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
                    {step.hours_to_learn} hours | Demand: {step.demand_score} | {step.free ? 'Free' : 'Paid'}
                  </p>
                  <a href={step.resource_url} target="_blank" rel="noreferrer"
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
                    {step.platform}
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
