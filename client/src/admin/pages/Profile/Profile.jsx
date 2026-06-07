import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Phone, Building2, ShieldCheck, CreditCard } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  // Default to a fallback if user is somehow not in context yet
  const currentUser = user || {
    name: 'Loading...',
    email: '...',
    role: 'client'
  };

  const isClient = currentUser.role === 'client' || currentUser.role === 'user';

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '(555) 123-4567',
    club: currentUser.club_name || 'City Tigers'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    alert("Profile updated successfully!");
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Premium Header */}
      <div style={{ 
        marginBottom: '3rem', 
        padding: '3rem', 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(204,255,0,0.1) 0%, rgba(0,0,0,0) 100%)', 
        border: '1px solid rgba(204,255,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Blur */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            background: '#1a1a1a', border: '2px solid var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(204,255,0,0.15)'
          }}>
            <User size={48} color="var(--accent-primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'white', marginBottom: '0.25rem' }}>
              Your <span style={{ color: 'var(--accent-primary)' }}>Profile</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Manage your personal information {isClient && "and subscription details"}.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isClient ? '1.2fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* Personal Info Section */}
        <div className="card" style={{ 
          padding: '2.5rem', 
          backgroundColor: 'rgba(18,18,18,0.6)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '24px', 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <User size={22} color="var(--accent-primary)" /> Personal Information
          </h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--accent-primary)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--accent-primary)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="var(--accent-primary)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Club / Organization</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} color="var(--accent-primary)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="club" value={formData.club} onChange={handleChange} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem 2rem', fontSize: '1rem', alignSelf: 'flex-start', boxShadow: '0 10px 20px -10px rgba(204,255,0,0.5)' }}>
              Save Changes
            </button>
          </form>
        </div>

        {/* Client Only Section: Offers & Billing */}
        {isClient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Active Offer */}
            <div className="card" style={{ padding: '2.5rem', backgroundColor: 'rgba(18,18,18,0.6)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ShieldCheck size={22} color="var(--accent-primary)" /> Current Active Offer
              </h2>
              <div style={{ background: 'linear-gradient(145deg, rgba(204, 255, 0, 0.08) 0%, rgba(204, 255, 0, 0.02) 100%)', border: '1px solid rgba(204, 255, 0, 0.2)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: '-10%', top: '-20%', opacity: 0.1 }}>
                  <ShieldCheck size={120} color="var(--accent-primary)" />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Monthly Plan</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Renews on <span style={{ color: 'white', fontWeight: 600 }}>Nov 05, 2026</span></div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', position: 'relative', zIndex: 1 }}>
                  $29<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>/mo</span>
                </div>
              </div>
            </div>

            {/* Offer History */}
            <div className="card" style={{ padding: '2.5rem', backgroundColor: 'rgba(18,18,18,0.6)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', flex: 1 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <CreditCard size={22} color="var(--accent-primary)" /> Offer History
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { plan: 'Monthly Plan', date: 'Oct 05, 2026', amount: '$29.00', status: 'Paid' },
                  { plan: 'Monthly Plan', date: 'Sep 05, 2026', amount: '$29.00', status: 'Paid' },
                  { plan: 'Weekly Plan', date: 'Aug 28, 2026', amount: '$9.00', status: 'Paid' }
                ].map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '1.25rem', background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>{item.plan}</div>
                      <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>{item.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{item.amount}</span>
                      <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.status}</span>
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
};

export default Profile;
