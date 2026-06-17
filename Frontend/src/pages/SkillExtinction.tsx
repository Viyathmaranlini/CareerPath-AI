import { useState } from 'react'
import axios from 'axios'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'
import { useLanguage } from '../LanguageContext'

const SKILL_CATEGORIES = {
  '🔥 Trending': ['python', 'react', 'typescript', 'docker', 'kubernetes', 'aws'],
  '⚠️ Declining': ['jquery', 'php', 'angularjs'],
  '✅ Stable': ['java', 'sql', 'vue'],
}

export default function SkillExtinction() {
  const { t } = useLanguage()
  const [skill, setSkill] = useState('')
  const [result, setResult] = useState<any>(null)
  const [compareSkill, setCompareSkill] = useState('')
  const [compareResult, setCompareResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'analyze' | 'compare'>('analyze')

  const handleCheck = async (skillName?: string) => {
    const checkSkill = skillName || skill
    if (!checkSkill) { setError('Skill name enter කරන්න!'); return }
    setLoading(true); setError('')
    try {
      const res = await axios.get(`http://localhost:8000/skills/extinction/${checkSkill}`)
      if (res.data.error) { setError(res.data.error); setResult(null) }
      else setResult(res.data)
    } catch { setError('Backend connect වෙන්න බැහැ!') }
    finally { setLoading(false) }
  }

  const handleCompare = async () => {
    if (!skill || !compareSkill) { setError('Skills දෙකම enter කරන්න!'); return }
    setLoading(true); setError('')
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`http://localhost:8000/skills/extinction/${skill}`),
        axios.get(`http://localhost:8000/skills/extinction/${compareSkill}`)
      ])
      setResult(res1.data)
      setCompareResult(res2.data)
    } catch { setError('Backend connect වෙන්න බැහැ!') }
    finally { setLoading(false) }
  }

  const getChartData = (r: any, r2?: any) => {
    if (!r) return []
    const years = ['2019','2020','2021','2022','2023','2024','2025','2026','2027','2028']
    return years.map(year => ({
      year,
      [r.skill]: r.historical_data[year] ?? r.predictions[year],
      ...(r2 ? { [r2.skill]: r2.historical_data[year] ?? r2.predictions[year] } : {}),
      isPredicted: !r.historical_data[year]
    }))
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          ☠️ Extinction Risk Analysis
        </div>
        <h1 className="section-title">{t('extinction_title')}</h1>
        <p className="section-subtitle">{t('extinction_subtitle')}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['analyze', 'compare'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setResult(null); setCompareResult(null); setError('') }}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: '1px solid',
              borderColor: activeTab === tab ? '#4f8ef7' : '#2a2a3a',
              background: activeTab === tab ? 'rgba(79,142,247,0.15)' : 'transparent',
              color: activeTab === tab ? '#4f8ef7' : '#9090b0',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem', fontWeight: 500
            }}>
            {tab === 'analyze' ? t('extinction_analyze') : t('extinction_compare')}
          </button>
        ))}
      </div>

      {/* Search Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        {activeTab === 'analyze' ? (
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <input className="input" placeholder={t('extinction_placeholder')}
                value={skill} onChange={e => setSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCheck()}
                style={{ flex: 1 }} />
              <button className="btn-primary" onClick={() => handleCheck()} style={{ flexShrink: 0, padding: '0 1.5rem' }}>
                {loading ? '...' : t('extinction_btn')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <input className="input" placeholder="Skill 1 (eg: python)"
                value={skill} onChange={e => setSkill(e.target.value)} />
              <span style={{ color: '#5a5a7a', fontWeight: 600 }}>VS</span>
              <input className="input" placeholder="Skill 2 (eg: jquery)"
                value={compareSkill} onChange={e => setCompareSkill(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleCompare} style={{ width: '100%' }}>
              {loading ? '...' : t('extinction_compare_btn')}
            </button>
          </div>
        )}

        {/* Quick Select */}
        <div style={{ marginTop: '1rem' }}>
          {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
            <div key={cat} style={{ marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#5a5a7a', marginRight: '0.5rem' }}>{cat}</span>
              {skills.map(s => (
                <button key={s} className="chip" onClick={() => { setSkill(s); handleCheck(s) }}
                  style={{ marginRight: '0.4rem', marginBottom: '0.4rem' }}>
                  {s}
                </button>
              ))}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && !result.error && (
        <div>
          {/* Status Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: compareResult ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {[result, ...(compareResult ? [compareResult] : [])].map((r, idx) => (
              <div key={idx} className="card" style={{ borderLeft: `4px solid ${r.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#f0f0ff', textTransform: 'capitalize', fontSize: '1.25rem', margin: 0 }}>{r.skill}</h3>
                  <span style={{ background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40`, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
                    {r.risk_level}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {[
                    { label: '2025 Demand', value: `${r.current_demand}%`, color: r.color },
                    { label: '2027 Forecast', value: `${r.predictions['2027']}%`, color: '#f0f0ff' },
                    { label: '2yr Trend', value: r.trend, color: r.trend.includes('+') ? '#10b981' : '#ef4444' },
                  ].map((stat, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '0.7rem', color: '#5a5a7a', marginTop: '2px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: `${r.color}10`, border: `1px solid ${r.color}25`, borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: '#d0d0e8' }}>
                  💡 {r.advice}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ color: '#f0f0ff', margin: 0 }}>
                {t('extinction_chart_title')}
                {compareResult && ` — ${result.skill} vs ${compareResult.skill}`}
              </h4>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#5a5a7a' }}>
                <span>━━ Historical</span>
                <span style={{ opacity: 0.6 }}>- - - Predicted</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={getChartData(result, compareResult || undefined)}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={result.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={result.color} stopOpacity={0} />
                  </linearGradient>
                  {compareResult && (
                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={compareResult.color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={compareResult.color} stopOpacity={0} />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="year" stroke="#5a5a7a" fontSize={12} />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} stroke="#5a5a7a" fontSize={12} />
                <Tooltip contentStyle={{ background: '#16161f', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#f0f0ff' }} formatter={(value: any) => [`${value}%`]} />
                <ReferenceLine x="2025" stroke="#5a5a7a" strokeDasharray="5 5" label={{ value: 'Now', fill: '#5a5a7a', fontSize: 11 }} />
                <Area type="monotone" dataKey={result.skill} stroke={result.color} strokeWidth={2.5} fill="url(#grad1)" dot={{ r: 3, fill: result.color }} />
                {compareResult && (
                  <Area type="monotone" dataKey={compareResult.skill} stroke={compareResult.color} strokeWidth={2.5} fill="url(#grad2)" dot={{ r: 3, fill: compareResult.color }} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}