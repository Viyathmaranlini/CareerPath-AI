import { useState } from 'react'
import axios from 'axios'

interface RoadmapStep {
  skill: string
  priority: string
  hours_to_learn: number
  resource_url: string
  platform: string
  free: boolean
  demand_score: number
}

interface RoadmapResult {
  target_role: string
  skills_to_learn: number
  roadmap: RoadmapStep[]
}

export default function Roadmap() {
  const [currentSkills, setCurrentSkills] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [result, setResult] = useState<RoadmapResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    'software engineer',
    'data scientist',
    'devops engineer',
    'frontend developer'
  ]

  const handleGenerate = async () => {
    if (!currentSkills || !targetRole) {
      setError('Skills සහ Role දෙකම enter කරන්න!')
      return
    }

    setLoading(true)
    setError('')

    const skillsList = currentSkills
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s)

    try {
      const res = await axios.post('http://localhost:8000/roadmap/generate', {
        current_skills: skillsList,
        target_role: targetRole
      })
      setResult(res.data)
    } catch {
      setError('Backend connect වෙන්න බැහැ — FastAPI running ද?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
        🗺️ My Learning Roadmap
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        ඔබේ current skills සහ target role දීලා personalized roadmap ගන්න
      </p>

      {/* Input Form */}
      <div style={{
        background: 'white', padding: '1.5rem',
        borderRadius: '12px', marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        {/* Current Skills */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem',
            fontWeight: 'bold', color: '#1e293b' }}>
            ඔබ දන්නා Skills (comma separated)
          </label>
          <input
            type="text"
            placeholder="python, html, css, javascript"
            value={currentSkills}
            onChange={e => setCurrentSkills(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem',
              border: '1px solid #e2e8f0', borderRadius: '8px',
              fontSize: '1rem', outline: 'none'
            }}
          />
        </div>

        {/* Target Role */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem',
            fontWeight: 'bold', color: '#1e293b' }}>
            Target Role
          </label>
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem',
              border: '1px solid #e2e8f0', borderRadius: '8px',
              fontSize: '1rem', outline: 'none', background: 'white'
            }}
          >
            <option value="">-- Role select කරන්න --</option>
            {roles.map(r => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: '#3b82f6', color: 'white',
            padding: '0.75rem 2rem', borderRadius: '8px',
            border: 'none', fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Generating...' : '🚀 Generate Roadmap'}
        </button>
      </div>

      {/* Roadmap Result */}
      {result && (
        <div>
          <div style={{
            background: '#eff6ff', padding: '1rem 1.5rem',
            borderRadius: '10px', marginBottom: '1.5rem',
            borderLeft: '4px solid #3b82f6'
          }}>
            <strong>🎯 Target: </strong>{result.target_role} &nbsp;|&nbsp;
            <strong>📚 ඉගෙනගන්න skills: </strong>{result.skills_to_learn}
          </div>

          {result.roadmap.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '2rem',
              color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem'
            }}>
              🎉 ඔබ දැනටමත් සියලු skills දන්නවා!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.roadmap.map((step, i) => (
                <div key={i} style={{
                  background: 'white', padding: '1.25rem',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${step.priority.includes('High') ? '#ef4444' : '#f59e0b'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b', textTransform: 'capitalize' }}>
                      {i + 1}. {step.skill}
                    </h3>
                    <span style={{
                      background: step.priority.includes('High') ? '#fee2e2' : '#fef3c7',
                      color: step.priority.includes('High') ? '#ef4444' : '#f59e0b',
                      padding: '2px 10px', borderRadius: '20px', fontSize: '0.85rem'
                    }}>
                      {step.priority}
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    ⏱️ {step.hours_to_learn} hours &nbsp;|&nbsp;
                    📊 Demand: {step.demand_score} &nbsp;|&nbsp;
                    {step.free ? '✅ Free' : '💰 Paid'}
                  </div>
                  
                    href={step.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#3b82f6', textDecoration: 'none',
                      fontSize: '0.9rem', fontWeight: 'bold'
                    }}
                  >
                    📖 {step.platform} →
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