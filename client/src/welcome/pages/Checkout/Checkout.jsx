import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Landmark, CheckCircle, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPlan = searchParams.get('plan') || 'monthly';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    clubName: '',
    plan: initialPlan,
    paymentMethod: 'Credit Card'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '').split('');
    if (pastedData.length > 0) {
      const newCode = [...verificationCode];
      pastedData.forEach((char, index) => {
        if (index < 6) newCode[index] = char;
      });
      setVerificationCode(newCode);
      
      // Auto-focus next empty or last input
      const nextIndex = Math.min(pastedData.length, 5);
      const nextInput = document.getElementById(`code-input-${nextIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const code = verificationCode.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, token: code }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network error during verification.');
    }
  };

  // Sync state if search params change
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && ['weekly', 'monthly', 'yearly'].includes(planParam)) {
      setFormData(prev => ({ ...prev, plan: planParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectPlan = (planName) => {
    setFormData(prev => ({ ...prev, plan: planName }));
    setSearchParams({ plan: planName });
  };

  const selectPaymentMethod = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Verification code sent to your email.');
        setIsVerificationStep(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error, make sure backend is running.');
    }
  };

  return (
    <div className="container py-section flex flex-col gap-6" style={{ minHeight: '80vh', padding: '4rem 2.5rem' }}>
      
      {/* Back to Home Navigation link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          <ArrowLeft size={16} /> Back to plans
        </button>
      </div>

      <div className="split-layout">
        
        {/* Left Column: Interactive Plans Row Stack */}
        <div className="flex flex-col gap-4">
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Choose Your Console
          </h2>
          <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            Select an account plan. You can easily switch between plans or cancel at any time inside your settings panel.
          </p>

          {/* Weekly Plan Selectable Row */}
          <div 
            className={`plan-horizontal-card ${formData.plan === 'weekly' ? 'active' : ''}`}
            onClick={() => selectPlan('weekly')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <CheckCircle size={24} color={formData.plan === 'weekly' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'bold', marginBottom: '0.2rem' }}>Weekly Pass</h4>
                <p className="text-secondary text-sm">Full dashboard features, billed weekly.</p>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-title)' }}>$9</span>
              <span className="text-secondary text-sm">/wk</span>
            </div>
          </div>

          {/* Monthly Plan Selectable Row */}
          <div 
            className={`plan-horizontal-card ${formData.plan === 'monthly' ? 'active' : ''}`}
            onClick={() => selectPlan('monthly')}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'absolute', right: '2rem', top: '-10px', background: 'var(--accent-primary)', color: 'black', padding: '1px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BEST VALUED SEASON</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <CheckCircle size={24} color={formData.plan === 'monthly' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'bold', marginBottom: '0.2rem' }}>Monthly Season</h4>
                <p className="text-secondary text-sm">Automated player analytics, billed monthly.</p>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-title)' }}>$29</span>
              <span className="text-secondary text-sm">/mo</span>
            </div>
          </div>

          {/* Yearly Plan Selectable Row */}
          <div 
            className={`plan-horizontal-card ${formData.plan === 'yearly' ? 'active' : ''}`}
            onClick={() => selectPlan('yearly')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <CheckCircle size={24} color={formData.plan === 'yearly' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'bold', marginBottom: '0.2rem' }}>Annual Pass</h4>
                <p className="text-secondary text-sm">Unlimited historical archives, billed yearly.</p>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-title)' }}>$290</span>
              <span className="text-secondary text-sm">/yr</span>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Activation Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '0.5rem', textAlign: 'center' }}>
            Activate Account
          </h2>
          <p className="text-secondary text-center mb-8" style={{ fontSize: '0.9rem' }}>
            Fill in your profile details to create your basketball team hub.
          </p>
          
          {error && <div className="text-danger mb-4 text-center text-sm bg-bg-secondary p-2.5 rounded" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', background: '#1c1313' }}>{error}</div>}
          {success && <div className="text-success mb-4 text-center text-sm bg-bg-secondary p-2.5 rounded" style={{ border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)', background: '#131c17' }}>{success}</div>}
          
          {isVerificationStep ? (
            <div className="flex flex-col gap-6" style={{ alignItems: 'center' }}>
              <p className="text-secondary text-center" style={{ fontSize: '0.95rem' }}>
                Enter the 6-digit code sent to <strong style={{color:'white'}}>{formData.email}</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                {verificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                    onPaste={handlePaste}
                    style={{
                      width: '48px', height: '56px', fontSize: '1.5rem', textAlign: 'center',
                      background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: 'white', outline: 'none'
                    }}
                  />
                ))}
              </div>
              <button onClick={handleVerify} className="btn btn-primary w-full text-lg" style={{ padding: '0.95rem 1.5rem', cursor: 'pointer', marginTop: '1rem' }}>
                Verify & Continue
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
              <div className="flex flex-col md:flex-row gap-4" style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Full Name</label>
                  <input type="text" name="name" className="input-field" placeholder="Coach Carter" value={formData.name} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Phone Number</label>
                  <input type="text" name="phone" className="input-field" placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4" style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Email Address</label>
                  <input type="email" name="email" className="input-field" placeholder="coach@example.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Password</label>
                  <input type="password" name="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Club / Team Name</label>
                <input type="text" name="clubName" className="input-field" placeholder="E.g., City Tigers" value={formData.clubName} onChange={handleChange} required />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Payment Method</label>
                <div className="payment-badge-row">
                  <div 
                    className={`payment-badge ${formData.paymentMethod === 'Credit Card' ? 'active' : ''}`}
                    onClick={() => selectPaymentMethod('Credit Card')}
                  >
                    <CreditCard size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Credit Card
                  </div>
                  
                  <div 
                    className={`payment-badge ${formData.paymentMethod === 'PayPal' ? 'active' : ''}`}
                    onClick={() => selectPaymentMethod('PayPal')}
                  >
                    <Wallet size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> PayPal
                  </div>
                  
                  <div 
                    className={`payment-badge ${formData.paymentMethod === 'Bank Transfer' ? 'active' : ''}`}
                    onClick={() => selectPaymentMethod('Bank Transfer')}
                  >
                    <Landmark size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Bank Transfer
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-6 w-full text-lg" style={{ padding: '0.95rem 1.5rem', cursor: 'pointer' }}>
                Activate Console
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Checkout;
