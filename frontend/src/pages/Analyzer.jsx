import { useState, useCallback, useRef } from 'react';
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
    { n: '01', label: 'Upload Resume' },
    { n: '02', label: 'Enter Job Target' },
    { n: '03', label: 'Get Results' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0d',
      color: '#e8e4dc',
      paddingTop: '100px',
      paddingBottom: '80px',
    }}>
      <div className="page-wrap" style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div style={{
          marginBottom: '64px',
          borderBottom: '1px solid #141414',
          paddingBottom: '40px',
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            — new analysis
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(56px, 8vw, 80px)',
            lineHeight: 0.9,
            color: '#f0ece4',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Analyze Your Skill Gap
          </h1>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', color: '#666', lineHeight: 1.6, maxWidth: '480px' }}>
            Upload your resume, enter your target role, and get instant AI insights. We'll cross-reference your skills to find the missing links.
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '48px', borderBottom: '1px solid #141414', paddingBottom: '32px' }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: i === 0 ? '#c8f135' : '#555', letterSpacing: '0.06em' }}>
                {s.n}
              </span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: '600', color: i === 0 ? '#e8e4dc' : '#555' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Resume Input section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: '700', color: '#e8e4dc' }}>
                Your Resume
              </h2>
              <div style={{ display: 'flex', gap: '1px', background: '#141414' }}>
                <button type="button" onClick={() => setInputMode('pdf')}
                  style={{
                    padding: '8px 16px', background: inputMode === 'pdf' ? '#e8e4dc' : '#0d0d0d',
                    color: inputMode === 'pdf' ? '#0d0d0d' : '#888',
                    fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em',
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s'
                  }}>
                  PDF Upload
                </button>
                <button type="button" onClick={() => setInputMode('text')}
                  style={{
                    padding: '8px 16px', background: inputMode === 'text' ? '#e8e4dc' : '#0d0d0d',
                    color: inputMode === 'text' ? '#0d0d0d' : '#888',
                    fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em',
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s'
                  }}>
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
                style={{
                  border: `1px solid ${dragOver ? '#c8f135' : file ? '#c8f135' : '#2a2a2a'}`,
                  padding: '64px 32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? '#151b04' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }} />
                {file ? (
                  <>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#c8f135', marginBottom: '8px' }}>[PDF SELECTED]</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: '600', color: '#e8e4dc', marginBottom: '8px' }}>{file.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#666', letterSpacing: '0.06em' }}>
                      {(file.size / 1024).toFixed(1)} KB — CLICK TO CHANGE
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '16px' }}>[UPLOAD]</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: '600', color: '#e8e4dc', marginBottom: '8px' }}>
                      Drop your PDF here or click to browse
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#666', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      PDF only · Max 5MB
                    </div>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste your resume content here..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  padding: '16px',
                  color: '#e8e4dc',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#c8f135'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            )}
          </div>

          {/* Job Target section */}
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: '700', color: '#e8e4dc', marginBottom: '16px' }}>
              Target Job
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Job Title / Role <span style={{ color: '#ff5c5c' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={jobTarget}
                onChange={(e) => setJobTarget(e.target.value)}
                placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  borderBottom: '1px solid #555',
                  padding: '12px 16px',
                  color: '#e8e4dc',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = '#c8f135'; e.target.style.borderBottomColor = '#c8f135'; }}
                onBlur={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.borderBottomColor = '#555'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Job Description <span style={{ color: '#555' }}>(optional but recommended)</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste the full job description here for a more accurate gap analysis..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  padding: '16px',
                  color: '#e8e4dc',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#c8f135'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          </div>

          {error && (
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              color: '#ff5c5c',
              background: '#220b0b',
              border: '1px solid #ff5c5c',
              padding: '12px 16px',
            }}>
              ERROR: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-raw"
            style={{ width: '100%', justifyContent: 'center', padding: '20px', fontSize: '16px' }}
          >
            {loading ? (
              <span style={{ display: 'inline-block', animation: 'blink 1.5s infinite' }}>
                {step || 'PROCESSING...'}
              </span>
            ) : 'ANALYZE MY SKILL GAP'}
          </button>
        </form>

      </div>
    </div>
  );
}
