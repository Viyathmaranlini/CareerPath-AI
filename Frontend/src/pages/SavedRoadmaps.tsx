import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'

export default function SavedRoadmaps() {
  const { token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    fetchRoadmaps()
  }, [isAuthenticated])

  const fetchRoadmaps = async () => {
    try {
      const res = await axios.get('http://localhost:8000/roadmap/saved', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRoadmaps(res.data.roadmaps)
    } catch {
      console.error('Failed to load roadmaps')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/roadmap/saved/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRoadmaps(roadmaps.filter(r => r.id !== id))
    } catch {
      console.error('Failed to delete')
    }
  }

  if (loading) return <div className="page" style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>

  return (
    <div className="page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">💾 My Saved Roadmaps</h1>
        <p className="section-subtitle">ඔබ save කළ learning roadmaps</p>
      </div>

      {roadmaps.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ color: '#f0f0ff', marginBottom: '0.5rem' }}>No saved roadmaps yet</h3>
          <p style={{ color: '#9090b0', marginBottom: '1.5rem' }}>Roadmap page එකේ generate කරලා save කරන්න!</p>
          <button className="btn-primary" onClick={() => navigate('/roadmap')}>Generate a Roadmap</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {roadmaps.map((r) => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ color: '#f0f0ff', textTransform: 'capitalize', margin: 0 }}>{r.target_role}</h3>
                  <p style={{ color: '#5a5a7a', fontSize: '0.78rem', marginTop: '4px' }}>
                    Saved on {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.78rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                  onClick={() => handleDelete(r.id)}>
                  Delete
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '1.2rem', color: '#4f8ef7' }}>{r.roadmap_data.skills_to_learn}</div>
                  <div className="stat-label">Skills</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '1.2rem', color: '#8b5cf6' }}>{r.roadmap_data.total_hours}h</div>
                  <div className="stat-label">Time</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ fontSize: '1.2rem', color: '#10b981' }}>
                    +LKR{(r.roadmap_data.salary_increase / 1000).toFixed(0)}k
                  </div>
                  <div className="stat-label">Salary Boost</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}