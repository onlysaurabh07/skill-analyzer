import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* ─── Ticker ──────────────────────────────────────────────── */
const TICKS = [
  'Resume Analysis', '/', 'Skill Gap Detection', '/',
  'AI Roadmaps', '/', '1,000+ Resumes Analyzed', '/',
  '95% Accuracy', '/', '< 30s Per Analysis', '/',
  'Career Readiness Score', '/', '50+ Career Paths', '/',
];

function Ticker() {
  const all = [...TICKS, ...TICKS];
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid #1c1c1c', borderBottom: '1px solid #1c1c1c', padding: '9px 0', whiteSpace: 'nowrap' }}>
      <div style={{ display: 'inline-flex', animation: 'ticker 30s linear infinite' }}>
        {all.map((t, i) => (
          <span key={i} style={{
            display: 'inline-block',
            padding: '0 22px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: t === '/' ? '#c8f135' : '#2e2e2e',
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Step row ─────────────────────────────────────────────── */
function StepRow({ num, title, desc, accent }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '56px 200px 1fr',
      gap: '0',
      borderBottom: '1px solid #141414',
      padding: '28px 0',
      alignItems: 'start',
    }}>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '11px', color: '#333',
        letterSpacing: '0.06em', paddingTop: '3px',
      }}>0{num}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '18px', fontWeight: '700',
        color: accent ? '#c8f135' : '#d8d4cc',
        letterSpacing: '-0.01em',
        paddingRight: '24px',
      }}>{title}</span>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '13px', color: '#444',
        lineHeight: 1.8,
      }}>{desc}</p>
    </div>
  );
}

/* ─── Feature row (text table) ─────────────────────────────── */
function FeatRow({ label, desc, tag }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr auto',
        gap: '0',
        borderBottom: '1px solid #141414',
        padding: '22px 0',
        alignItems: 'center',
        cursor: 'default',
        transition: 'background 0.15s',
        background: hov ? '#0f0f0f' : 'transparent',
        margin: '0 -32px',
        padding: '22px 32px',
      }}
    >
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '15px', fontWeight: '600',
        color: hov ? '#e8e4dc' : '#888',
        transition: 'color 0.15s',
        letterSpacing: '-0.005em',
      }}>{label}</span>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '13px', color: '#3a3a3a',
        lineHeight: 1.75,
        maxWidth: '520px',
        transition: 'color 0.15s',
      }}>{desc}</p>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '9px', letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: hov ? '#c8f135' : '#252525',
        transition: 'color 0.15s',
      }}>{tag}</span>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function Landing() {
  const [on, setOn] = useState(false);
  const [n, setN] = useState(1);

  useEffect(() => {
    setTimeout(() => setOn(true), 60);
    const t = setInterval(() => setN(x => x < 6 ? x + 1 : 1), 3400);
    return () => clearInterval(t);
  }, []);

  const features = [
    { label: 'Resume Parsing', desc: 'Drop your PDF. Every skill, project, role, and tech stack extracted instantly — no manual entry.', tag: 'Instant' },
    { label: 'Gap Detection', desc: 'We cross-reference your profile against the job requirements and flag exactly what you\'re missing.', tag: 'Precise' },
    { label: 'Readiness Score', desc: 'A single number — 0 to 100 — showing how close you are to the role right now.', tag: 'Clear' },
    { label: 'Weekly Roadmap', desc: 'A structured week-by-week learning plan with courses, projects, and milestones. No filler.', tag: 'Actionable' },
    { label: 'Progress Tracking', desc: 'Watch your score climb over time. Every skill acquired is reflected in your match percentage.', tag: 'Visual' },
    { label: 'Smart Courses', desc: "Recommendations ranked by your specific gaps — not what's popular, what you actually need.", tag: 'Ranked' },
  ];

  const steps = [
    { title: 'Upload Your Resume', desc: 'PDF drop. Our parser reads your skills, stack, projects, and experience levels in seconds.' },
    { title: 'Pick Your Target Role', desc: 'Choose from 50+ paths or paste a job description. We map every requirement.' },
    { title: 'Get Your Gap Report', desc: "A match score, a gap list, and a breakdown of what's blocking you — in under 30 seconds.", accent: true },
    { title: 'Follow the Roadmap', desc: 'Week-by-week learning plan drops in your dashboard. Start today, not next month.' },
  ];

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#e8e4dc' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '72px',
        paddingBottom: '64px',
        borderBottom: '1px solid #1a1a1a',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* — counter bottom left */}
        <div style={{
          position: 'absolute', bottom: '28px', left: '32px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px', color: '#2a2a2a',
          letterSpacing: '0.04em', zIndex: 10,
        }}>
          <span style={{ color: '#555' }}>{n}</span> / 6
        </div>

        {/* — scattered text stickers (no cards, no borders, no icons) */}

        {/* top right — job match number */}
        <div style={{
          position: 'absolute', top: '14%', right: '5%',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(48px, 7vw, 96px)',
          color: '#181818',
          lineHeight: 1,
          userSelect: 'none',
          zIndex: 1,
          animation: 'floatY 4s ease-in-out infinite',
        }}>
          78%
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.06em', marginTop: '4px' }}>match score</div>
        </div>

        {/* left middle — gap count */}
        <div style={{
          position: 'absolute', top: '38%', left: '3%',
          zIndex: 1,
          animation: 'floatY 5s ease-in-out infinite',
          animationDelay: '0.8s',
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>skills missing</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 64px)', color: '#1e1e1e', lineHeight: 1 }}>AWS · Docker · K8s</div>
        </div>

        {/* bottom right — time */}
        <div style={{
          position: 'absolute', bottom: '18%', right: '4%',
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px', color: '#222',
          letterSpacing: '0.06em',
          zIndex: 1,
          animation: 'floatY 3.8s ease-in-out infinite',
          animationDelay: '1.2s',
        }}>
          analysis in &lt; 30s
        </div>

        {/* top left — small accent tag */}
        <div style={{
          position: 'absolute', top: '12%', left: '4%',
          background: '#c8f135',
          color: '#0d0d0d',
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          fontWeight: '700',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '5px 10px',
          borderRadius: '2px',
          transform: 'rotate(-1.5deg)',
          zIndex: 1,
          userSelect: 'none',
        }}>
          AI — Powered
        </div>

        {/* bottom left — roadmap note */}
        <div style={{
          position: 'absolute', bottom: '22%', left: '3%',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '12px', color: '#222',
          maxWidth: '160px',
          lineHeight: 1.6,
          zIndex: 1,
        }}>
          Week 1–2: AWS Core<br />Week 3–4: Docker<br />Week 5–6: Kubernetes
        </div>

        {/* — main text block */}
        <div className="page-wrap" style={{ position: 'relative', zIndex: 5 }}>
          <div style={{
            opacity: on ? 1 : 0,
            transform: on ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>

            {/* The huge type */}
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(72px, 13vw, 180px)',
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
              color: '#f0ece4',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              FIND YOUR
            </div>

            {/* second line — SKILL inline with rotated tag */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap', marginBottom: '0' }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(72px, 13vw, 180px)',
                lineHeight: 0.92,
                color: '#f0ece4',
                textTransform: 'uppercase',
              }}>SKILL</div>

              {/* inline rotated yellow tag — no icon */}
              <div style={{
                background: '#c8f135',
                color: '#0d0d0d',
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(11px, 1.2vw, 14px)',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '7px 14px',
                borderRadius: '3px',
                transform: 'rotate(-2.5deg)',
                marginBottom: '18px',
                flexShrink: 0,
                userSelect: 'none',
              }}>
                GAP
              </div>
            </div>

            {/* — descriptor + CTA row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '48px',
              alignItems: 'flex-end',
              marginTop: '32px',
            }}>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '15px', color: '#444',
                lineHeight: 1.8, maxWidth: '400px',
              }}>
                Upload your resume, pick a target role, get an AI skill gap analysis and a personalized weekly learning plan. Under 30 seconds.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <Link to="/signup" className="btn-raw">Analyze My Resume</Link>
                <Link to="/login" className="btn-ghost">Log in</Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────── */}
      <Ticker />

      {/* ── NUMBERS ──────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid #141414' }}>
        <div className="page-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { n: '1,000+', l: 'Resumes Analyzed' },
              { n: '50+', l: 'Career Paths' },
              { n: '95%', l: 'Accuracy Rate' },
              { n: '<30s', l: 'Analysis Time' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '44px 24px 40px',
                borderRight: i < 3 ? '1px solid #141414' : 'none',
              }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(44px, 5.5vw, 72px)',
                  lineHeight: 1, color: '#e8e4dc',
                  letterSpacing: '0.01em',
                  marginBottom: '8px',
                }}>{s.n}</div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px', color: '#333',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET (text table) ─────────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px 0', borderBottom: '1px solid #141414' }}>
        <div className="page-wrap">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>— how it works</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: '700', letterSpacing: '-0.02em', color: '#d8d4cc', lineHeight: 1.1 }}>Four steps,<br />zero guesswork</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #141414' }}>
            {steps.map((s, i) => <StepRow key={i} num={i + 1} title={s.title} desc={s.desc} accent={s.accent} />)}
          </div>

        </div>
      </section>

      {/* ── FEATURES (text list table) ──────────────────────── */}
      <section id="features" style={{ padding: '80px 0', borderBottom: '1px solid #141414', background: '#080808' }}>
        <div className="page-wrap">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>— capabilities</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: '700', letterSpacing: '-0.02em', color: '#d8d4cc', lineHeight: 1.1 }}>Built to get<br />you hired</div>
            </div>
            <Link to="/signup" className="btn-raw" style={{ alignSelf: 'flex-end' }} >Start Free →</Link>
          </div>

          <div style={{ borderTop: '1px solid #141414', marginTop: '32px' }}>
            {features.map((f, i) => <FeatRow key={i} label={f.label} desc={f.desc} tag={f.tag} />)}
          </div>

        </div>
      </section>

      {/* ── WHAT THE ANALYSIS GIVES YOU ─────────────────────── */}
      <section id="dashboard" style={{ padding: '80px 0', borderBottom: '1px solid #141414' }}>
        <div className="page-wrap">

          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>— output</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: '700', letterSpacing: '-0.02em', color: '#d8d4cc', lineHeight: 1.1 }}>What you get<br />after the analysis</div>
          </div>

          {/* Big text breakdown — no charts, no cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#141414' }}>
            {[
              {
                label: 'Match Score',
                val: '78 / 100',
                sub: 'for Full-Stack Engineer',
                note: 'How closely your current skills match the target role.',
              },
              {
                label: 'Skills You Have',
                val: 'React, Node.js, Python, Git',
                sub: '4 of 7 core skills',
                note: 'Verified from your resume — no self-assessment required.',
              },
              {
                label: 'Skills You Need',
                val: 'AWS, Docker, Kubernetes',
                sub: '3 critical gaps',
                note: 'Ranked by how much they impact your match score.',
              },
              {
                label: 'Time to Ready',
                val: '7 weeks',
                sub: 'at 1hr/day',
                note: 'Based on difficulty of missing skills and your current level.',
              },
              {
                label: 'Courses Suggested',
                val: '12 courses',
                sub: 'ranked by impact',
                note: 'Curated from Udemy, AWS Training, and the Linux Foundation.',
              },
              {
                label: 'Weekly Roadmap',
                val: 'Week-by-week plan',
                sub: 'starts Week 1: AWS Core',
                note: 'Concrete, ordered, tied to real resources. Not a vague list.',
              },
            ].map((item, i) => (
              <div key={i} style={{ background: '#0d0d0d', padding: '32px 28px' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>{item.label}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', color: '#e8e4dc', lineHeight: 1, marginBottom: '4px' }}>{item.val}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#c8f135', marginBottom: '14px' }}>{item.sub}</div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#333', lineHeight: 1.75 }}>{item.note}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── BIG CTA ───────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', borderBottom: '1px solid #141414', position: 'relative', overflow: 'hidden' }}>
        <div className="page-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>— start now</div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(56px, 10vw, 140px)',
            lineHeight: 0.9,
            color: '#f0ece4',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}>
            CLOSE<br />THE GAP<span style={{ color: '#c8f135' }}>.</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-raw" style={{ fontSize: '14px', padding: '15px 32px' }}>
              Analyze My Resume — Free
            </Link>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#252525', letterSpacing: '0.04em' }}>
              No credit card · Results in 30s
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ padding: '28px 0' }}>
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#2a2a2a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SkillGap.ai
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px', color: '#252525',
                textDecoration: 'none', letterSpacing: '0.06em',
                textTransform: 'uppercase', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.target.style.color = '#555'}
                onMouseLeave={e => e.target.style.color = '#252525'}
              >{l}</a>
            ))}
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#1e1e1e' }}>
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>

    </div>
  );
}
