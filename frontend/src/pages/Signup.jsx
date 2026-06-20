import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await api.register(form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#e8e4dc',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: '700', fontSize: '15px',
              color: '#e8e4dc', letterSpacing: '-0.01em',
            }}>
              SkillGap<span style={{ color: '#c8f135' }}>.</span>ai
            </span>
          </Link>
          
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '48px',
            lineHeight: 1,
            color: '#f0ece4',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            Create Account
          </h1>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#666', letterSpacing: '0.04em' }}>
            Join now. Analyze your skill gaps.
          </p>
        </div>

        {error && (
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: '#ff5c5c',
            background: '#220b0b',
            border: '1px solid #ff5c5c',
            padding: '12px 16px',
            marginBottom: '24px',
          }}>
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. John Doe"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                padding: '12px 16px',
                color: '#e8e4dc',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#c8f135'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@domain.com"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                padding: '12px 16px',
                color: '#e8e4dc',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#c8f135'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 6 characters"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                padding: '12px 16px',
                color: '#e8e4dc',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#c8f135'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-raw"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '16px' }}
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '32px', borderTop: '1px solid #141414', paddingTop: '24px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#555' }}>
            Already have an account?{' '}
          </span>
          <Link to="/login" style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px', color: '#e8e4dc',
            textDecoration: 'none',
            borderBottom: '1px solid #555',
          }}>
            Sign in
          </Link>
        </div>
        
      </div>
    </div>
  );
}
