import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) { setError('Email සහ Password දෙකම enter කරන්න!'); return }
    setLoading(true); setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.success) navigate('/')
    else setError(result.error || 'Login failed')
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
          <h2 style={{ color: '#f0f0ff', fontSize: '1.25rem', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: '#9090b0', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            CareerPath AI ට login වෙන්න
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', color: '#9090b0', fontSize: '0.85rem', marginTop: '1.5rem' }}>
          Account නැද්ද? <Link to="/signup" style={{ color: '#4f8ef7', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}