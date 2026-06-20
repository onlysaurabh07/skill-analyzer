import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '54px', display: 'flex', alignItems: 'center',
      borderBottom: scrolled ? '1px solid #161616' : '1px solid transparent',
      background: scrolled ? 'rgba(13,13,13,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

        {/* Logo — text only, no icon */}
        <Link to={token ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: '700', fontSize: '15px',
            color: '#e8e4dc', letterSpacing: '-0.01em',
          }}>
            SkillGap<span style={{ color: '#c8f135' }}>.</span>ai
          </span>
        </Link>

        {/* Nav links */}
        {!token && (
          <div className="hide-mobile" style={{ display: 'flex', gap: '32px' }}>
            {[['How It Works', '#how-it-works'], ['Features', '#features'], ['Output', '#dashboard']].map(([l, h]) => (
              <a key={l} href={h} style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px', color: '#333', textDecoration: 'none',
                letterSpacing: '0.07em', textTransform: 'uppercase',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.target.style.color = '#777'}
                onMouseLeave={e => e.target.style.color = '#333'}
              >{l}</a>
            ))}
          </div>
        )}

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {token ? (
            <>
              <Link to="/dashboard" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Dashboard</Link>
              <Link to="/analyze" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Analyze</Link>
              <span style={{ color: '#1e1e1e' }}>·</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#2a2a2a' }}>{user?.name}</span>
              <button onClick={handleLogout} style={{
                fontFamily: "'Space Mono', monospace", fontSize: '10px',
                color: '#333', background: 'transparent', border: '1px solid #1e1e1e',
                borderRadius: '2px', padding: '6px 14px', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.07em', transition: 'border-color 0.15s, color 0.15s',
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                fontFamily: "'Space Mono', monospace", fontSize: '10px',
                color: '#333', textDecoration: 'none', textTransform: 'uppercase',
                letterSpacing: '0.07em', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.target.style.color = '#777'}
                onMouseLeave={e => e.target.style.color = '#333'}
              >Log in</Link>
              <Link to="/signup" className="btn-raw" style={{ padding: '7px 16px', fontSize: '11px' }}>
                Get Started →
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
