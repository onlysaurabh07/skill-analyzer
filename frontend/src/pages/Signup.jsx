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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 pt-20">
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">SkillGap AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1">Start analyzing your skill gaps today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
              <input
                id="signup-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Saurabh Kumar"
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                id="signup-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input
                id="signup-password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
