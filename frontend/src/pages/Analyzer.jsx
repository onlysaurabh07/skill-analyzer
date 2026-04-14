import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Analyzer() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobTarget, setJobTarget] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [inputMode, setInputMode] = useState('pdf'); // 'pdf' | 'text'
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');
  const fileInputRef = useRef();

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') setFile(dropped);
    else setError('Please upload a PDF file.');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (inputMode === 'pdf' && !file) { setError('Please upload your resume PDF.'); return; }
    if (inputMode === 'text' && !resumeText.trim()) { setError('Please paste your resume text.'); return; }
    if (!jobTarget.trim()) { setError('Please enter a job title/target role.'); return; }

    setLoading(true);
    setStep('Parsing your resume...');

    const formData = new FormData();
    if (file) formData.append('resume', file);
    if (resumeText) formData.append('resumeText', resumeText);
    formData.append('jobTarget', jobTarget);
    formData.append('jobDescription', jobDescription);

    try {
      setStep('Analyzing skill gap with AI...');
      const result = await api.analyze(formData, token);
      setStep('Building your roadmap...');
      setTimeout(() => navigate(`/results/${result._id}`), 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setStep('');
    }
  };

  const steps = [
    { n: 1, label: 'Upload Resume' },
    { n: 2, label: 'Enter Job Target' },
    { n: 3, label: 'Get Results' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <div className="absolute top-32 left-1/4 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Analyze Your Skill Gap</h1>
          <p className="text-slate-400">Upload your resume, enter your target role, and get instant AI insights.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i === 0 ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600 text-slate-500'
              }`}>{s.n}</div>
              <span className={`text-xs ${i === 0 ? 'text-blue-400' : 'text-slate-500'}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-slate-700 mx-1" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume input */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">📄 Your Resume</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => setInputMode('pdf')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${inputMode === 'pdf' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                  PDF Upload
                </button>
                <button type="button" onClick={() => setInputMode('text')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${inputMode === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                  Paste Text
                </button>
              </div>
            </div>

            {inputMode === 'pdf' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-blue-400 bg-blue-500/10' : file ? 'border-green-500/60 bg-green-500/5' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                }`}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                  onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }} />
                {file ? (
                  <>
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-green-400 font-medium">{file.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-3">📄</div>
                    <p className="text-slate-300 font-medium">Drop your PDF here or click to browse</p>
                    <p className="text-slate-500 text-xs mt-2">PDF only · Max 5MB</p>
                  </>
                )}
              </div>
            ) : (
              <textarea
                id="resume-text"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste your resume content here..."
                className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            )}
          </div>

          {/* Job Target */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">🎯 Target Job</h2>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Job Title / Role <span className="text-red-400">*</span></label>
              <input
                id="job-target"
                type="text"
                required
                value={jobTarget}
                onChange={(e) => setJobTarget(e.target.value)}
                placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Job Description <span className="text-slate-500">(optional but recommended)</span></label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste the full job description here for a more accurate gap analysis..."
                className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <button
            id="analyze-submit"
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {step || 'Analyzing...'}
              </span>
            ) : '⚡ Analyze My Skill Gap'}
          </button>
        </form>
      </div>
    </div>
  );
}
