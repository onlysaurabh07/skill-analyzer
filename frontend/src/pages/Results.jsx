import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="64" cy="64" r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-extrabold text-white">{score}%</div>
        <div className="text-xs text-slate-400">Match</div>
      </div>
    </div>
  );
}

function SkillTag({ label, type }) {
  const styles = {
    match: 'bg-green-500/15 border-green-500/30 text-green-400',
    missing: 'bg-red-500/15 border-red-500/30 text-red-400',
    neutral: 'bg-slate-700/50 border-slate-600 text-slate-300',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${styles[type]}`}>
      {type === 'match' && '✅'} {type === 'missing' && '❌'} {label}
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin w-10 h-10 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        <p className="text-slate-400">Loading results...</p>
      </div>
    </div>
  );

  if (!data) return null;

  const scoreColor = data.matchScore >= 70 ? 'text-green-400' : data.matchScore >= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-sm mb-1">Analysis Results</div>
            <h1 className="text-3xl font-bold text-white">🎯 {data.jobTarget}</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/analyze" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors">
              New Analysis
            </Link>
            <Link to="/dashboard" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing score={data.matchScore} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              {data.matchScore >= 70 ? '🚀 Great match!' : data.matchScore >= 40 ? '📈 Good progress' : '🌱 Room to grow'}
            </h2>
            <p className="text-slate-400 mb-4">
              You match <span className={`font-semibold ${scoreColor}`}>{data.matchScore}%</span> of the skills required for <strong className="text-white">{data.jobTarget}</strong>.
              {data.missingSkills.length > 0 && ` You're missing ${data.missingSkills.length} key skill${data.missingSkills.length > 1 ? 's' : ''}.`}
            </p>
            <div className="flex gap-4 justify-center sm:justify-start text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{data.matchingSkills.length}</div>
                <div className="text-slate-500">Matched</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{data.missingSkills.length}</div>
                <div className="text-slate-500">Missing</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{data.roadmap?.length || 0}</div>
                <div className="text-slate-500">Week Plan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">✅</span> Matching Skills ({data.matchingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.matchingSkills.length > 0
                ? data.matchingSkills.map((s) => <SkillTag key={s} label={s} type="match" />)
                : <p className="text-slate-500 text-sm">No matching skills detected.</p>}
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">❌</span> Missing Skills ({data.missingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.missingSkills.length > 0
                ? data.missingSkills.map((s) => <SkillTag key={s} label={s} type="missing" />)
                : <p className="text-slate-400 text-sm">🎉 No missing skills! You're a great fit.</p>}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        {data.roadmap?.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🗺️ Your {data.roadmap.length}-Week Learning Roadmap
            </h3>

            {/* Week tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {data.roadmap.map((w, i) => (
                <button
                  key={w.week}
                  onClick={() => setActiveWeek(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeWeek === i
                      ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg'
                      : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Week {w.week}
                </button>
              ))}
            </div>

            {/* Active week content */}
            {data.roadmap[activeWeek] && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    Week {data.roadmap[activeWeek].week}: {data.roadmap[activeWeek].focus}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Topics */}
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Topics to Cover</h5>
                    <ul className="space-y-2">
                      {data.roadmap[activeWeek].topics?.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-blue-400 mt-0.5">▸</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Resources</h5>
                    <ul className="space-y-2">
                      {data.roadmap[activeWeek].resources?.map((r, i) => (
                        <li key={i}>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
                          >
                            <span className="text-xs bg-blue-500/20 border border-blue-500/30 rounded px-1.5 py-0.5 text-blue-300 capitalize">
                              {r.type || 'link'}
                            </span>
                            <span className="group-hover:underline">{r.title}</span>
                            <svg className="w-3 h-3 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline mini-view */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <h5 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Full Timeline Overview</h5>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700" />
                {data.roadmap.map((w, i) => (
                  <div
                    key={w.week}
                    onClick={() => setActiveWeek(i)}
                    className={`relative pl-10 pb-4 cursor-pointer group ${i === data.roadmap.length - 1 ? 'pb-0' : ''}`}
                  >
                    <div className={`absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      activeWeek === i ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600 bg-slate-800 text-slate-500 group-hover:border-blue-500/50'
                    }`}>{w.week}</div>
                    <div className={`text-sm transition-colors ${activeWeek === i ? 'text-blue-400 font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      <strong>Week {w.week}:</strong> {w.focus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
