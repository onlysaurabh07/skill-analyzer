import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#c8f135' : score >= 40 ? '#f5c518' : '#ff5c5c';
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '11px',
      color: color,
      padding: '4px 8px',
      border: `1px solid ${color}40`,
      borderRadius: '2px'
    }}>
      {score}%
    </span>
  );
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistory(token)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + b.matchScore, 0) / history.length)
    : 0;

  const bestScore = history.length ? Math.max(...history.map(h => h.matchScore)) : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0d',
      color: '#e8e4dc',
      paddingTop: '100px',
      paddingBottom: '80px',
    }}>
      <div className="page-wrap" style={{ maxWidth: '1000px' }}>
        
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '64px',
          borderBottom: '1px solid #141414',
          paddingBottom: '40px',
        }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              — user overview
            </div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(56px, 8vw, 80px)',
              lineHeight: 0.9,
              color: '#f0ece4',
              textTransform: 'uppercase',
            }}>
              Welcome Back, {user?.name?.split(' ')[0]}
            </h1>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', color: '#666', maxWidth: '400px', lineHeight: 1.6 }}>
              Here is your skill gap overview and analysis history. Start a new analysis to see how your gaps have closed.
            </p>
            <Link to="/analyze" className="btn-raw">
              New Analysis →
            </Link>
          </div>
        </div>

        {/* Stats Row - pure text grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: '#141414', marginBottom: '64px' }}>
          {[
            { label: 'Total Analyses', value: history.length },
            { label: 'Avg Match Score', value: `${avgScore}%` },
            { label: 'Best Score', value: `${bestScore}%` },
          ].map((s, i) => (
            <div key={s.label} style={{ background: '#0d0d0d', padding: '40px 32px' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', color: '#e8e4dc', lineHeight: 1, marginBottom: '8px' }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* History Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: '700', color: '#f0ece4' }}>
              Analysis History
            </h2>
            {history.length > 0 && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>
                {history.length} RECORD{history.length > 1 ? 'S' : ''}
              </span>
            )}
          </div>

          <div style={{ borderTop: '1px solid #141414' }}>
            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#333', marginBottom: '16px' }}>NO ANALYSES YET</div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: '#666', marginBottom: '32px' }}>
                  Run your first skill gap analysis to generate your roadmap.
                </p>
                <Link to="/analyze" className="btn-ghost" style={{ display: 'inline-block' }}>
                  Analyze Resume
                </Link>
              </div>
            ) : (
              <div>
                {history.map((item) => (
                  <Link
                    key={item._id}
                    to={`/results/${item._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '24px 0',
                      borderBottom: '1px solid #141414',
                      textDecoration: 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0f0f0f'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingLeft: '16px' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.06em' }}>
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                      </span>
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: '600', color: '#e8e4dc', marginBottom: '4px' }}>
                          {item.jobTarget}
                        </div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#444' }}>
                          {item.matchingSkills?.length || 0} Matched · {item.missingSkills?.length || 0} Missing
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingRight: '16px' }}>
                      <ScoreBadge score={item.matchScore} />
                      <span style={{ color: '#333', fontSize: '18px' }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips - pure text block format */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #141414' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#c8f135', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              PRO TIP
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
              Paste the full job description for a more accurate match score. Generic job titles give approximate results.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              ROADMAP
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
              Follow your generated learning plan weekly. Consistent 1–2 hours/day of focused learning closes gaps in 4–6 weeks.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
