import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface Skill {
  skill: string
  recent_count: number
  growth_percent: number
  status: string
}

export default function TrendingSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8000/skills/trending')
      .then(res => {
        setSkills(res.data.trending)
        setLoading(false)
      })
      .catch(() => {
        setError('Backend connect වෙන්න බැහැ — FastAPI running ද?')
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
      ⏳ Loading skills...
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
      ⚠️ {error}
    </div>
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
        🔥 Trending Skills
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Last 30 days job postings වලින් analyze කළ skills
      </p>

      {/* Chart */}
      {skills.length > 0 && (
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '1.5rem', marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skills.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="recent_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skill Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {skills.map((skill, i) => (
          <div key={i} style={{
            background: 'white', padding: '1rem 1.25rem',
            borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#1e293b', textTransform: 'capitalize' }}>
                {skill.skill}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {skill.recent_count} jobs
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                color: skill.growth_percent > 0 ? '#10b981' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {skill.growth_percent > 0 ? '+' : ''}{skill.growth_percent}%
              </div>
              <div style={{ fontSize: '0.8rem' }}>{skill.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}