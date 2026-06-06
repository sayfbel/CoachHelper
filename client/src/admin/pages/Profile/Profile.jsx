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
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'white' }}>
          Your <span style={{ color: 'var(--accent-primary)' }}>Profile</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information {isClient && "and subscription details"}.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isClient ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* Personal Info Section */}
        <div className="card" style={{ padding: '2rem', backgroundColor: '#18181b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--accent-primary)" /> Personal Information
          </h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#a1a1aa" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#a1a1aa" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#a1a1aa" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Club / Organization</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} color="#a1a1aa" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="club" value={formData.club} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
              Save Changes
            </button>
          </form>
        </div>

        {/* Client Only Section: Offers & Billing */}
        {isClient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Active Offer */}
            <div className="card" style={{ padding: '2rem', backgroundColor: '#18181b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--accent-primary)" /> Current Active Offer
              </h2>
              <div style={{ background: 'rgba(204, 255, 0, 0.05)', border: '1px solid rgba(204, 255, 0, 0.2)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Monthly Plan</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Renews on Nov 05, 2026</div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>$29<span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/mo</span></div>
              </div>
            </div>

            {/* Offer History */}
            <div className="card" style={{ padding: '2rem', backgroundColor: '#18181b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--accent-primary)" /> Offer History
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { plan: 'Monthly Plan', date: 'Oct 05, 2026', amount: '$29.00', status: 'Paid' },
                  { plan: 'Monthly Plan', date: 'Sep 05, 2026', amount: '$29.00', status: 'Paid' },
                  { plan: 'Weekly Plan', date: 'Aug 28, 2026', amount: '$9.00', status: 'Paid' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>{item.plan}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: 'white', fontWeight: 600 }}>{item.amount}</span>
                      <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>{item.status}</span>
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
