import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, KeyRound, Mail, HelpCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../../../assets/hoopchach.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set global auth state
        login(data.user);

        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          if (data.order && (data.order.status === 'Pending' || data.order.status === 'Rejected')) {
            navigate('/waiting', { state: { order: data.order } });
          } else {
            navigate('/user');
          }
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error, make sure backend is running.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          if (data.order && (data.order.status === 'Pending' || data.order.status === 'Rejected')) {
            navigate('/waiting', { state: { order: data.order } });
          } else {
            navigate('/user');
          }
        }
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error during Google login.');
    }
  };

  return (
    <div className="container py-section flex flex-col gap-6" style={{ minHeight: '80vh', padding: '4rem 2.5rem' }}>

      {/* Back navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>

      <div className="split-layout" style={{ gridTemplateColumns: '1.1fr 1fr', alignItems: 'stretch', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

        {/* Left Column: Unified Branding & Standalone Court Card */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              <KeyRound size={12} />
              <span>Secure Command Console</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', lineHeight: '1.1', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              HOOPCOACH <span style={{ color: 'var(--accent-primary)' }}>INTELLIGENCE</span> HUB
            </h1>
            <p className="text-secondary" style={{ lineHeight: '1.5', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Sign in to manage your active basketball season, record bench plays live, and analyze player performance metrics.
            </p>
          </div>

          {/* SVG Court strategy map - Styled as a standalone card matching standard platform styles */}
          <div className='basketball-floor'>
            <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(204, 255, 0, 0.05) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

            <svg viewBox="0 0 320 200" style={{ width: '100%', maxWidth: '450px', display: 'block', opacity: 0.75, margin: '0 auto' }}>
              {/* Outer boundary */}
              <rect x="5" y="5" width="310" height="190" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" rx="4" />
              {/* Center line */}
              <line x1="160" y1="5" x2="160" y2="195" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <circle cx="160" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              {/* Three point line left */}
              <path d="M 5 30 A 70 70 0 0 1 5 170" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="5" y1="30" x2="25" y2="30" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="5" y1="170" x2="25" y2="170" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Three point line right */}
              <path d="M 315 30 A 70 70 0 0 0 315 170" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="315" y1="30" x2="295" y2="30" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="315" y1="170" x2="295" y2="170" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Key areas */}
              <rect x="5" y="75" width="50" height="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <rect x="265" y="75" width="50" height="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              {/* strategy play */}
              <circle cx="100" cy="65" r="4.5" fill="var(--accent-primary)" />
              <circle cx="130" cy="125" r="4.5" fill="var(--accent-primary)" />
              <circle cx="70" cy="135" r="4.5" fill="var(--accent-primary)" />
              <path d="M 75 130 Q 100 125 125 125" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx="95" cy="80" r="5" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="135" cy="140" r="5" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="20" cy="100" r="3" fill="#ff4444" />
            </svg>
          </div>
        </div>

        {/* Right Column: Premium Login Box */}
        <div className="card" style={{ padding: '2.5rem', minHeight: '485px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '0.5rem', textAlign: 'center' }}>
              Welcome Back
            </h2>
            <p className="text-secondary text-center mb-6" style={{ fontSize: '0.9rem' }}>
              Sign in to access your coaching command dashboard.
            </p>

            {error && (
              <div className="text-danger mb-4 text-center text-sm bg-bg-secondary p-2.5 rounded" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', background: '#1c1313' }}>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="input-field"
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="admin@coachhelper.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <KeyRound size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3 w-full text-lg" style={{ padding: '0.95rem 1.5rem', cursor: 'pointer' }}>
                Sign In
              </button>
            </form>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ margin: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_black"
                shape="rectangular"
                text="signin_with"
                size="large"
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
            <p className="text-secondary text-sm">
              New to HoopCoach?{' '}
              <Link to="/checkout" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', transition: 'var(--transition)' }}>
                Get Started
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
