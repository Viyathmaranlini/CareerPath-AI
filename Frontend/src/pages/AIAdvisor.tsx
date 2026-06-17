import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { useLanguage } from '../LanguageContext'

export default function AIAdvisor() {
  const { t } = useLanguage()
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

  const validateStep1 = () => {
    const nameRegex = /^[a-zA-Z\u0D80-\u0DFF\s]{2,50}$/
    if (!form.name || !nameRegex.test(form.name.trim())) {
      setError('Valid නම් enter කරන්න! (Letters only, 2-50 characters)'); return false
    }
    const degreeRegex = /^[a-zA-Z\s\.]{3,60}$/
    if (!form.degree || !degreeRegex.test(form.degree.trim())) {
      setError('Valid Degree enter කරන්න! (eg: BSc Computer Science)'); return false
    }
    const degreeKeywords = ['bsc', 'ba', 'beng', 'msc', 'phd', 'hnd', 'diploma', 'degree', 'computer', 'science', 'engineering', 'technology', 'it', 'software', 'business', 'management']
    if (!degreeKeywords.some(k => form.degree.toLowerCase().includes(k))) {
      setError('Valid Academic Degree enter කරන්න! (eg: BSc Computer Science, HND IT)'); return false
    }
    if (!form.university) { setError('University select කරන්න!'); return false }
    setError(''); return true
  }

  const validateStep2 = () => {
    if (!form.skills || form.skills.trim().length < 2) {
      setError('අඩුම skill එකක් enter කරන්න!'); return false
    }
    const validSkills = ['python', 'javascript', 'java', 'react', 'angular', 'vue', 'html', 'css',
      'sql', 'mysql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'azure',
      'git', 'linux', 'typescript', 'nodejs', 'express', 'django', 'flask', 'fastapi',
      'machine learning', 'ml', 'ai', 'tensorflow', 'pytorch', 'pandas', 'numpy',
      'php', 'laravel', 'c#', 'dotnet', '.net', 'spring', 'kotlin', 'swift', 'flutter',
      'dart', 'r', 'scala', 'rust', 'go', 'golang', 'redis', 'graphql', 'rest', 'api']
    const enteredSkills = form.skills.split(',').map(s => s.trim().toLowerCase())
    const invalidSkills = enteredSkills.filter(s => s.length > 0 && !validSkills.some(v => s.includes(v) || v.includes(s)))
    if (invalidSkills.length > 0 && invalidSkills[0].length > 1) {
      setError(`"${invalidSkills[0]}" valid tech skill එකක් නෙවෙයි!`); return false
    }
    setError(''); return true
  }

  const validateStep3 = () => {
    if (!form.target_role) { setError(t('ai_target_role') + ' select කරන්න!'); return false }
    if (!form.goal || form.goal.trim().length < 10) { setError('Goal clearly ලියන්න! (අඩුම 10 characters)'); return false }
    setError(''); return true
  }

  const ErrorBox = ({ msg }: { msg: string }) => (
    <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem' }}>
      ⚠️ {msg}
    </div>
  )

  return (
    <div className="page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">{t('ai_title')}</h1>
        <p className="section-subtitle">{t('ai_subtitle')}</p>
      </div>

      {!result ? (
        <div style={{ maxWidth: '680px' }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= s ? 'linear-gradient(90deg, #4f8ef7, #8b5cf6)' : '#2a2a3a', transition: 'background 0.3s' }} />
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: '#5a5a7a', marginBottom: '1.5rem' }}>Step {step} of 3</p>

          {/* Step 1 */}
          {step === 1 && (
            <div className="card">
              <h3 style={{ color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem' }}>{t('ai_step1')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label">{t('ai_name')} *</label>
                  <input className="input" placeholder="Viyathmaranlini"
                    value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t('ai_degree')} *</label>
                  <input className="input" placeholder="BSc Computer Science"
                    value={form.degree} onChange={e => update('degree', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t('ai_university')} *</label>
                  <select className="input" value={form.university} onChange={e => update('university', e.target.value)}>
                    <option value="">-- Select කරන්න --</option>
                    {universities.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              {error && <ErrorBox msg={error} />}
              <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}
                onClick={() => { if (validateStep1()) setStep(2) }}>
                {t('ai_continue')}
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="card">
              <h3 style={{ color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem' }}>{t('ai_step2')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label">{t('ai_skills')} *</label>
                  <input className="input" placeholder="python, react, sql, docker"
                    value={form.skills} onChange={e => update('skills', e.target.value)} />
                  <p style={{ fontSize: '0.75rem', color: '#5a5a7a', marginTop: '0.4rem' }}>Comma separated</p>
                </div>
                <div>
                  <label className="label">{t('ai_experience')}</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[0, 1, 2, 3, 5, 7, 10].map(y => (
                      <button key={y} onClick={() => update('experience_years', y)}
                        style={{
                          padding: '8px 16px', borderRadius: '8px', border: '1px solid',
                          borderColor: form.experience_years === y ? '#4f8ef7' : '#2a2a3a',
                          background: form.experience_years === y ? 'rgba(79,142,247,0.15)' : 'transparent',
                          color: form.experience_years === y ? '#4f8ef7' : '#9090b0',
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s'
                        }}>
                        {y === 0 ? 'Fresher' : `${y}yr`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {error && <ErrorBox msg={error} />}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setError(''); setStep(1) }}>{t('ai_back')}</button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={() => { if (validateStep2()) setStep(3) }}>{t('ai_continue')}</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="card">
              <h3 style={{ color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem' }}>{t('ai_step3')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label">{t('ai_target_role')} *</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {roles.map(r => (
                      <button key={r} onClick={() => update('target_role', r)}
                        style={{
                          padding: '8px 14px', borderRadius: '8px', border: '1px solid',
                          borderColor: form.target_role === r ? '#8b5cf6' : '#2a2a3a',
                          background: form.target_role === r ? 'rgba(139,92,246,0.15)' : 'transparent',
                          color: form.target_role === r ? '#8b5cf6' : '#9090b0',
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize', transition: 'all 0.2s'
                        }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">{t('ai_goal')} *</label>
                  <textarea className="input" placeholder="6 months වල Sri Lanka IT job එකක් ගන්න..."
                    value={form.goal} onChange={e => update('goal', e.target.value)}
                    rows={3} style={{ resize: 'vertical' }} />
                  <p style={{ fontSize: '0.75rem', color: '#5a5a7a', marginTop: '0.4rem' }}>අඩුම 10 characters</p>
                </div>
              </div>
              {error && <ErrorBox msg={error} />}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setError(''); setStep(2) }}>{t('ai_back')}</button>
                <button className="btn-primary" style={{ flex: 2 }}
                  onClick={() => { if (validateStep3()) handleSubmit() }} disabled={loading}>
                  {loading ? t('ai_analyzing') : t('ai_submit')}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: '#f0f0ff', fontSize: '1.25rem', fontWeight: 600 }}>
                🤖 AI Career Analysis for {form.name}
              </h2>
              <p style={{ color: '#9090b0', fontSize: '0.875rem' }}>
                {form.university} · {form.degree} · {form.experience_years === 0 ? 'Fresher' : `${form.experience_years}yr exp`}
              </p>
            </div>
            <button className="btn-secondary" onClick={() => { setResult(null); setStep(1); setError('') }}>
              {t('ai_start_over')}
            </button>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#d0d0e8' }}>
              <ReactMarkdown>{result.advice}</ReactMarkdown>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>{result.roadmap_steps}</div>
              <div className="stat-label">{t('ai_skills_to_learn')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#4f8ef7', textTransform: 'capitalize', fontSize: '1rem' }}>
                {form.target_role}
              </div>
              <div className="stat-label">{t('ai_target_role')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}