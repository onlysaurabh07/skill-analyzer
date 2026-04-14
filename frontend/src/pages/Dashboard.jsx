import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function ScoreBadge({ score }) {
  const color = score >= 70 ? 'text-green-400 bg-green-500/10 border-green-500/30'
    : score >= 40 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    : 'text-red-400 bg-red-500/10 border-red-500/30';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-bold ${color}`}>
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
    <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <div className="absolute top-24 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400 mt-1">Here's your skill gap overview</p>
          </div>
          <Link
            to="/analyze"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 whitespace-nowrap"
          >
            ⚡ New Analysis
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Analyses', value: history.length, icon: '📊', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
            { label: 'Avg Match Score', value: `${avgScore}%`, icon: '🎯', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/20' },
            { label: 'Best Score', value: `${bestScore}%`, icon: '🏆', color: 'from-green-500/20 to-green-600/10 border-green-500/20' },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-6`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">📋 Analysis History</h2>
            {history.length > 0 && (
              <span className="text-slate-500 text-sm">{history.length} record{history.length > 1 ? 's' : ''}</span>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <svg className="animate-spin w-8 h-8 text-blue-500 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <p className="text-slate-500">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No analyses yet</h3>
              <p className="text-slate-400 mb-6">Run your first skill gap analysis to get started.</p>
              <Link to="/analyze" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all">
                Analyze Now →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/40">
              {history.map((item) => (
                <Link
                  key={item._id}
                  to={`/results/${item._id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-700/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700 flex items-center justify-center text-lg">
                      🎯
                    </div>
                    <div>
                      <div className="text-white font-medium group-hover:text-blue-400 transition-colors">{item.jobTarget}</div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' · '}
                        {item.matchingSkills?.length || 0} matched · {item.missingSkills?.length || 0} missing
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ScoreBadge score={item.matchScore} />
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick tips */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-1">💡 Pro Tip</h4>
            <p className="text-slate-400 text-sm">Paste the full job description for a more accurate match score. Generic job titles give approximate results.</p>
          </div>
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-violet-400 mb-1">🗺️ Roadmap</h4>
            <p className="text-slate-400 text-sm">Follow your AI-generated learning plan weekly. Consistent 1–2 hours/day of focused learning closes gaps in 4–6 weeks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
