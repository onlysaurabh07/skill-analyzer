import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function ScoreRing({ score }) {
  const color = score >= 70 ? '#c8f135' : score >= 40 ? '#f5c518' : '#ff5c5c';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', border: `1px solid ${color}`, background: `${color}10` }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '96px', lineHeight: 1, color: color }}>
        {score}%
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: color, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '8px' }}>
        Match Score
      </div>
    </div>
  );
}

function SkillTag({ label, type }) {
  const styles = {
    match: { color: '#c8f135', borderColor: '#c8f13540', bg: '#c8f13505' },
    missing: { color: '#ff5c5c', borderColor: '#ff5c5c40', bg: '#ff5c5c05' },
    neutral: { color: '#888', borderColor: '#333', bg: '#111' },
  };
  const s = styles[type];
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Space Mono', monospace",
      fontSize: '11px',
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.borderColor}`,
      padding: '6px 12px',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }}>
      {type === 'match' && '[+] '} {type === 'missing' && '[-] '} {label}
    </span>
  );
}

export default function Results() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const id = window.location.pathname.split('/').pop();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    api.getAnalysis(id, token)
      .then(setData)
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.2em', animation: 'blink 1.5s infinite' }}>
        Processing Results...
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', paddingTop: '100px', paddingBottom: '80px', color: '#e8e4dc' }}>
      <div className="page-wrap" style={{ maxWidth: '1000px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '64px', borderBottom: '1px solid #141414', paddingBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                — analysis results
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 6vw, 64px)', lineHeight: 0.9, color: '#f0ece4', textTransform: 'uppercase', maxWidth: '600px' }}>
                {data.jobTarget}
              </h1>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/analyze" className="btn-ghost">
                New Analysis
              </Link>
              <Link to="/dashboard" className="btn-ghost">
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Mode Alert */}
        {data.isSampleData && (
          <div style={{ padding: '24px', background: '#261b04', border: '1px solid #f5c518', marginBottom: '40px' }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#f5c518', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              [Demo Mode Active]
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: '#e8e4dc', lineHeight: 1.6 }}>
              The AI analysis service is currently unavailable (Quota Exceeded). We are showing <strong>simulated data</strong> based on your target role so you can still preview the experience.
            </p>
          </div>
        )}

        {/* Score Card / Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', marginBottom: '64px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
            <ScoreRing score={data.matchScore} />
            
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: '700', color: '#e8e4dc', marginBottom: '16px' }}>
                {data.matchScore >= 70 ? 'Strong Alignment' : data.matchScore >= 40 ? 'Moderate Gap' : 'Significant Gap'}
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', color: '#888', lineHeight: 1.6, marginBottom: '32px', maxWidth: '500px' }}>
                You match <strong style={{ color: '#e8e4dc' }}>{data.matchScore}%</strong> of the skills required for <strong style={{ color: '#e8e4dc' }}>{data.jobTarget}</strong>.
                {data.missingSkills.length > 0 && ` You are missing ${data.missingSkills.length} key skills identified in the market.`}
              </p>
              
              <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid #2a2a2a', paddingTop: '24px' }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#c8f135', lineHeight: 1 }}>{data.matchingSkills.length}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Matched</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#ff5c5c', lineHeight: 1 }}>{data.missingSkills.length}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Missing</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#e8e4dc', lineHeight: 1 }}>{data.roadmap?.length || 0}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '80px', borderTop: '1px solid #141414', paddingTop: '64px' }}>
          <div>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#c8f135', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '24px' }}>
              [+] Verified Skills ({data.matchingSkills.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {data.matchingSkills.length > 0
                ? data.matchingSkills.map((s) => <SkillTag key={s} label={s} type="match" />)
                : <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#555' }}>No matching skills detected.</p>}
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#ff5c5c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '24px' }}>
              [-] Missing Skills ({data.missingSkills.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {data.missingSkills.length > 0
                ? data.missingSkills.map((s) => <SkillTag key={s} label={s} type="missing" />)
                : <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#555' }}>No missing skills detected.</p>}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        {data.roadmap?.length > 0 && (
          <div style={{ borderTop: '1px solid #141414', paddingTop: '64px' }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#e8e4dc', textTransform: 'uppercase', marginBottom: '40px' }}>
              {data.roadmap.length}-Week Learning Plan
            </h3>

            {/* Week tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '40px', borderBottom: '1px solid #141414' }}>
              {data.roadmap.map((w, i) => (
                <button
                  key={w.week}
                  onClick={() => setActiveWeek(i)}
                  style={{
                    padding: '12px 24px',
                    background: activeWeek === i ? '#e8e4dc' : 'transparent',
                    color: activeWeek === i ? '#0d0d0d' : '#888',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    border: activeWeek === i ? '1px solid #e8e4dc' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => { if (activeWeek !== i) e.currentTarget.style.color = '#e8e4dc' }}
                  onMouseLeave={e => { if (activeWeek !== i) e.currentTarget.style.color = '#888' }}
                >
                  Week {w.week}
                </button>
              ))}
            </div>

            {/* Active week content */}
            {data.roadmap[activeWeek] && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                <div style={{ gridColumn: '1 / -1', marginBottom: '16px' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Week {data.roadmap[activeWeek].week} Focus
                  </div>
                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: '700', color: '#e8e4dc' }}>
                    {data.roadmap[activeWeek].focus}
                  </h4>
                </div>

                {/* Topics */}
                <div style={{ border: '1px solid #2a2a2a', padding: '32px' }}>
                  <h5 style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#e8e4dc', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '24px' }}>
                    Topics to Cover
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.roadmap[activeWeek].topics?.map((t, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.5 }}>
                        <span style={{ color: '#555', fontFamily: "'Space Mono', monospace", fontSize: '10px', marginTop: '4px' }}>{String(i + 1).padStart(2, '0')}</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div style={{ border: '1px solid #2a2a2a', padding: '32px' }}>
                  <h5 style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#e8e4dc', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '24px' }}>
                    Recommended Resources
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {data.roadmap[activeWeek].resources?.map((r, i) => (
                      <li key={i}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            textDecoration: 'none', color: '#c8f135',
                            fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          <span style={{
                            fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#0d0d0d', background: '#c8f135',
                            padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.04em'
                          }}>
                            {r.type || 'link'}
                          </span>
                          <span style={{ borderBottom: '1px solid #c8f13540' }}>{r.title}</span>
                          <span style={{ fontSize: '12px' }}>↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
