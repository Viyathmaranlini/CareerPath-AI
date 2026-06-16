import { useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function SkillExtinction() {
  const [skill, setSkill] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const popularSkills = ['python', 'react', 'jquery', 'php', 'docker', 'typescript', 'aws', 'java', 'sql', 'kubernetes']

  const handleCheck = async (skillName?: string) => {
    const checkSkill = skillName || skill
    if (!checkSkill) { setError('Skill name enter කරන්න!'); return }
    setLoading(true); setError('')
    try {
      const res = await axios.get(`http://localhost:8000/skills/extinction/${checkSkill}`)
      setResult(res.data)
    } catch {
      setError('Skill data නෑ හෝ backend connect වෙන්න බැහැ!')
    } finally {
      setLoading(false) }
  }

  const getChartData = () => {
    if (!result) return []
    const historical = Object.entries(result.historical_data).map(([year, value]) => ({
      year, demand: value, type: 'historical'
    }))
    const predictions = Object.entries(result.predictions).map(([year, value]) => ({
      year, predicted: value, type: 'predicted'
    }))
    return [...historical, ...predictions]
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>☠️ Skill Extinction Predictor</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Sri Lanka IT market වල skill extinction trends — 2019-2028 forecast
      </p>

      {/* Search */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input type="text" placeholder="Skill name (eg: jquery, python, php)"
            value={skill} onChange={e => setSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
          <button onClick={() => handleCheck()}
            style={{ background: '#1e293b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? '...' : 'Analyze'}
          </button>
        </div>

        {/* Quick select */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {popularSkills.map(s => (
            <button key={s} onClick={() => { setSkill(s); handleCheck(s) }}
              style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0',
                background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#475569' }}>
              {s}
            </button>
          ))}
        </div>

        {error && <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      {/* Result */}
      {result && !result.error && (
        <div>
          {/* Status Card */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem',
            borderLeft: `6px solid ${result.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b', textTransform: 'capitalize', fontSize: '1.5rem' }}>
                {result.skill}
              </h3>
              <span style={{ background: result.color, color: 'white', padding: '6px 16px',
                borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {result.risk_level}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: result.color }}>{result.current_demand}%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>2025 Demand</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{result.predictions['2027']}%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>2027 Forecast</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: result.trend.includes('+') ? '#10b981' : '#ef4444' }}>
                  {result.trend}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>2yr Trend</div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', color: '#1e293b' }}>
              💡 <strong>Advice:</strong> {result.advice}
            </div>
          </div>

          {/* Chart */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#1e293b' }}>📊 Demand Trend 2019-2028</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(value: any) => [`${value}%`, 'Demand']} />
                <ReferenceLine x="2025" stroke="#94a3b8" strokeDasharray="5 5" label="Now" />
                <Line type="monotone" dataKey="demand" stroke={result.color} strokeWidth={3} dot={{ r: 5 }} name="Historical" />
                <Line type="monotone" dataKey="predicted" stroke={result.color} strokeWidth={2}
                  strokeDasharray="5 5" dot={{ r: 4 }} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              ━━━ Historical &nbsp;&nbsp; - - - Predicted (2026-2028)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}