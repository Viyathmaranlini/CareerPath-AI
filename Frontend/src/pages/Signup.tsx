import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!name || !email || !password) { setError('සියලු fields fill කරන්න!'); return }
    if (password.length < 6) { setError('Password අඩුම 6 characters ඕනේ!'); return }
    if (password !== confirmPassword) { setError('Passwords match වෙන්නේ නෑ!'); return }

    setLoading(true); setError('')
    const result = await signup(name, email, password)
    setLoading(false)
    if (result.success) navigate('/')
    else setError(result.error || 'Signup failed')
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
          <h2 style={{ color: '#f0f0ff', fontSize: '1.25rem', fontWeight: 700 }}>Create Account</h2>
          <p style={{ color: '#9090b0', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            CareerPath AI start කරන්න
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Full Name</label>
            <input className="input" placeholder="Viyathmaranlini"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="අඩුම 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
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
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', color: '#9090b0', fontSize: '0.85rem', marginTop: '1.5rem' }}>
          Already have account? <Link to="/login" style={{ color: '#4f8ef7', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}