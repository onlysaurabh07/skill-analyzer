import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={token ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            SkillGap AI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link>
              <Link to="/analyze" className="text-slate-400 hover:text-white text-sm transition-colors">Analyze</Link>
              <div className="h-5 w-px bg-slate-700" />
              <span className="text-slate-400 text-sm hidden sm:block">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Login</Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-blue-500 to-violet-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
