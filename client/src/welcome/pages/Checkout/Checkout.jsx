import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Landmark, CheckCircle, ArrowLeft, UploadCloud } from 'lucide-react';

const Checkout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPlan = searchParams.get('plan') || 'monthly';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    clubName: '',
    plan: initialPlan,
    paymentMethod: 'Credit Card'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [offers, setOffers] = useState([]);
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
        setOrderId(data.orderId);
        setSuccess('Account verified! Please proceed to payment proof.');
        setStep(3);
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

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/payment-methods');
        if (response.ok) {
          const data = await response.json();
          setPaymentMethods(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, paymentMethod: data[0].name }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch payment methods', err);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/offers');
        if (response.ok) {
          const data = await response.json();
          setOffers(data);
          // If no initialPlan or if initialPlan doesn't match an offer name, default to the first one or the popular one
          if (data.length > 0) {
            const hasInitial = data.find(o => o.name === initialPlan);
            if (!hasInitial) {
              const popular = data.find(o => o.is_popular);
              setFormData(prev => ({ ...prev, plan: popular ? popular.name : data[0].name }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch offers', err);
      }
    };
    
    fetchPaymentMethods();
    fetchOffers();
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
        setStep(2);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error, make sure backend is running.');
    }
  };

  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    if (!receiptFile || !orderId) {
      setError('Please select a file to upload.');
      return;
    }
    setError('');
    
    const formDataObj = new FormData();
    formDataObj.append('receipt', receiptFile);
    formDataObj.append('orderId', orderId);

    try {
      const response = await fetch('http://localhost:3000/api/upload-receipt', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        setSuccess('Receipt uploaded! Your account is pending admin approval.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error during upload.');
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

          {offers.length === 0 ? (
            <div style={{ color: '#a1a1aa', textAlign: 'center', padding: '2rem' }}>Loading offers...</div>
          ) : (
            offers.map((offer) => (
              <div 
                key={offer.id}
                className={`plan-horizontal-card ${formData.plan === offer.name ? 'active' : ''}`}
                onClick={() => selectPlan(offer.name)}
                style={{ position: 'relative' }}
              >
                {offer.is_popular && (
                  <div style={{ position: 'absolute', right: '2rem', top: '-10px', background: 'var(--accent-primary)', color: 'black', padding: '1px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BEST VALUED</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <CheckCircle size={24} color={formData.plan === offer.name ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'} style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'bold', marginBottom: '0.2rem' }}>{offer.name}</h4>
                    <p className="text-secondary text-sm">{offer.description}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-title)' }}>${parseFloat(offer.price).toFixed(0)}</span>
                  <span className="text-secondary text-sm">/{offer.period === 'Weekly' ? 'wk' : offer.period === 'Monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Checkout Activation Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '0.5rem', textAlign: 'center' }}>
            Activate Account
          </h2>
          <p className="text-secondary text-center mb-8" style={{ fontSize: '0.9rem' }}>
            Fill in your profile details to create your basketball team hub.
          </p>
          
          {error && (
            <div className="mb-6 text-center rounded-lg" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 text-center rounded-lg" style={{ border: '1px solid rgba(204, 255, 0, 0.3)', color: 'var(--accent-primary)', background: 'rgba(204, 255, 0, 0.05)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
              <CheckCircle size={18} /> {success}
            </div>
          )}
          
          {step === 2 && (
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
                      background: '#121212', border: '1px solid #3f3f46', borderRadius: '8px', color: 'white', outline: 'none'
                    }}
                  />
                ))}
              </div>
              <button onClick={handleVerify} className="btn btn-primary w-full text-lg" style={{ padding: '0.95rem 1.5rem', cursor: 'pointer', marginTop: '1rem' }}>
                Verify & Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <form className="flex flex-col gap-6" onSubmit={handleReceiptUpload}>
              <div style={{ background: 'rgba(204, 255, 0, 0.05)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Payment Information</h3>
                <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Please transfer the amount for your selected plan to the following account:
                </p>
                <div style={{ background: '#121212', padding: '1rem', borderRadius: '8px', border: '1px solid #3f3f46' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>RIB Number ({formData.paymentMethod})</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', letterSpacing: '2px' }}>
                    {paymentMethods.find(pm => pm.name === formData.paymentMethod)?.rib || '0000 0000 0000 0000 0000'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Upload Receipt</label>
                <label 
                  htmlFor="receipt-upload" 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: receiptFile ? 'rgba(204, 255, 0, 0.05)' : '#121212',
                    border: `1px dashed ${receiptFile ? 'var(--accent-primary)' : '#3f3f46'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => !receiptFile && (e.currentTarget.style.borderColor = '#a1a1aa')}
                  onMouseLeave={(e) => !receiptFile && (e.currentTarget.style.borderColor = '#3f3f46')}
                >
                  <UploadCloud size={32} color={receiptFile ? 'var(--accent-primary)' : '#a1a1aa'} style={{ marginBottom: '1rem' }} />
                  <span style={{ color: receiptFile ? 'white' : '#a1a1aa', fontSize: '0.9rem', fontWeight: receiptFile ? 'bold' : 'normal', textAlign: 'center' }}>
                    {receiptFile ? receiptFile.name : 'Click to browse or drag image here'}
                  </span>
                  <input 
                    id="receipt-upload"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    style={{ display: 'none' }}
                    required 
                  />
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-full text-lg" style={{ padding: '0.95rem 1.5rem', cursor: 'pointer' }}>
                Submit Payment Proof
              </button>
            </form>
          )}

          {step === 1 && (
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

              <div className="flex flex-col md:flex-row gap-4" style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Club / Team Name</label>
                  <input type="text" name="clubName" className="input-field" placeholder="E.g., City Tigers" value={formData.clubName} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>City</label>
                  <input type="text" name="city" className="input-field" placeholder="E.g., New York" value={formData.city} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Payment Method</label>
                {paymentMethods.length === 0 ? (
                  <div style={{ color: '#a1a1aa', fontSize: '0.9rem', fontStyle: 'italic' }}>No payment methods available right now.</div>
                ) : (
                  <div className="payment-badge-row">
                    {paymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`payment-badge ${formData.paymentMethod === method.name ? 'active' : ''}`}
                        onClick={() => selectPaymentMethod(method.name)}
                      >
                        <Wallet size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {method.name}
                      </div>
                    ))}
                  </div>
                )}
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
