import { Link } from 'react-router-dom';

const features = [
  { icon: '📄', title: 'Resume Analyzer', desc: 'Upload your PDF resume and we instantly extract your skills, experience, and projects.' },
  { icon: '🎯', title: 'Skill Gap Engine', desc: 'Compare your skills against the job requirements and get a precise match percentage.' },
  { icon: '🗺️', title: 'AI Roadmap', desc: 'Get a personalized week-by-week learning plan with curated resources to close the gap.' },
  { icon: '📊', title: 'Visual Dashboard', desc: 'Track all your analyses in one place. See your progress at a glance.' },
];

const stats = [
  { value: '95%', label: 'Skill match accuracy' },
  { value: '6 weeks', label: 'Average roadmap length' },
  { value: '1000+', label: 'Resources curated' },
  { value: '< 30s', label: 'Analysis time' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8 text-sm text-blue-400">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            AI-Powered Career Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Know Your Gaps.
            </span>
            <br />
            <span className="text-white">Build Your Future.</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, enter your dream job — and get an instant AI-powered skill gap analysis with a personalized weekly learning roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-blue-500/25 hover:scale-105 text-lg"
            >
              Start For Free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 border border-slate-700 transition-all text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything you need to get hired</h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">From resume parsing to action plans — SkillGap AI handles the entire analysis pipeline in seconds.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to close the gap?</h2>
          <p className="text-slate-400 mb-8">Join thousands of learners who've used SkillGap AI to land their dream jobs.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl hover:scale-105"
          >
            Analyze My Resume →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} SkillGap AI. Built with 🤖 AI.
      </footer>
    </div>
  );
}
