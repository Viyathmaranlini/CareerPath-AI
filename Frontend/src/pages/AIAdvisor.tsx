import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function AIAdvisor() {
  const [form, setForm] = useState({
    name: '',
    degree: '',
    university: '',
    skills: '',
    experience_years: 0,
    target_role: '',
    goal: ''
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const universities = ['SLIIT', 'UOM', 'UCSC', 'NSBM', 'IIT', 'Informatics', 'Other']
  const roles = ['software engineer', 'data scientist', 'devops engineer', 'frontend developer', 'ml engineer']

  const handleSubmit = async () => {
    if (!form.name || !form.degree || !form.target_role) {
      setError('සියලු fields fill කරන්න!')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:8000/ai/career-advice', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim().toLowerCase()),
        experience_years: Number(form.experience_years)
      })
      setResult(res.data)
    } catch {
      setError('AI service connect වෙන්න බැහැ!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
        🤖 AI Career Advisor
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        ඔබේ profile දීලා Sri Lanka IT market based AI advice ගන්න
      </p>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>

        {/* Name */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>ඔබේ නම</label>
          <input type="text" placeholder="Viyathmaranlini"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
        </div>

        {/* Degree */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Degree</label>
          <input type="text" placeholder="BSc Computer Science"
            value={form.degree} onChange={e => setForm({...form, degree: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
        </div>

        {/* University */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>University</label>
          <select value={form.university} onChange={e => setForm({...form, university: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', background: 'white' }}>
            <option value="">-- University select කරන්න --</option>
            {universities.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>ඔබේ Skills (comma separated)</label>
          <input type="text" placeholder="python, react, sql"
            value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
        </div>

        {/* Experience */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Experience (years)</label>
          <input type="number" min="0" max="20"
            value={form.experience_years} onChange={e => setForm({...form, experience_years: Number(e.target.value)})}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
        </div>

        {/* Target Role */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Target Role</label>
          <select value={form.target_role} onChange={e => setForm({...form, target_role: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', background: 'white' }}>
            <option value="">-- Role select කරන්න --</option>
            {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>

        {/* Goal */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>ඔබේ Goal</label>
          <textarea placeholder="6 months වල Sri Lanka IT job එකක් ගන්න..."
            value={form.goal} onChange={e => setForm({...form, goal: e.target.value})}
            rows={3}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ background: loading ? '#94a3b8' : '#7c3aed', color: 'white',
            padding: '0.75rem 2rem', borderRadius: '8px', border: 'none',
            fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}>
          {loading ? '🤖 AI Thinking...' : '🚀 Get AI Career Advice'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#7c3aed', marginBottom: '1rem' }}>🤖 AI Career Advice</h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#1e293b', fontSize: '0.95rem' }}>
            <ReactMarkdown>{result.advice}</ReactMarkdown>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b' }}>
            📊 Roadmap steps: {result.roadmap_steps} skills to learn
          </div>
        </div>
      )}
    </div>
  )
}