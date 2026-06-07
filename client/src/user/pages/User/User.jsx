import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import UserSidebar from '../../components/UserSidebar';
import { Search, Bell, MessageSquare, Home, Clock } from 'lucide-react';

import Overview from '../Overview/Overview';
import Plan from '../Plan/Plan';

const User = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/users/${user.id}/profile`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a2d34', color: 'white' }}>Loading dashboard...</div>;
  }

  const isPlanActive = profile && profile.plan && new Date(profile.plan_end_date) > new Date();

  if (!isPlanActive) {
    return (
      <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background radial glow */}
        <div style={{ position: 'absolute', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(204, 255, 0, 0.06) 0%, transparent 60%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 1 }} />
        
        <div style={{ 
            padding: '3.5rem 3rem', 
            maxWidth: '520px', 
            width: '100%', 
            textAlign: 'center', 
            background: 'rgba(18, 18, 18, 0.85)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(204, 255, 0, 0.04)',
            borderRadius: '24px',
            position: 'relative',
            zIndex: 2
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--accent-primary)' }}>
            <Clock size={32} strokeWidth={2} />
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            ACCOUNT NOT ACTIVE
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            {profile && !profile.plan ? 'Your payment is currently being reviewed by our administrators. Please allow up to 24 hours for a response.' : 'Your plan has expired. Please contact support or purchase a new plan.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" className="btn btn-secondary w-full" style={{ padding: '0.85rem', textAlign: 'center', fontSize: '0.95rem' }}>Back Home</Link>
            <button 
                onClick={() => { logout(); navigate('/'); }} 
                className="btn btn-primary w-full" 
                style={{ padding: '0.85rem', fontSize: '0.95rem' }}
            >
                Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', padding: '1rem', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <aside style={{ marginRight: '1.5rem' }}>
        <UserSidebar />
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: 'calc(100% - 1.5rem)' }}>
        {/* Top Bar matching admin screenshot layout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121212', padding: '0.6rem 1rem', borderRadius: '40px', marginBottom: '1.5rem' }}>
          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem', flex: 1 }}>
            <Search size={18} color="#a1a1aa" />
            <input type="text" placeholder="Search anything..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem', width: '250px' }} />
          </div>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ background: '#27272a', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', cursor: 'pointer' }}>
              <Bell size={16} />
            </button>
            <button style={{ background: '#27272a', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', cursor: 'pointer' }}>
              <MessageSquare size={16} />
            </button>
            <Link to="/" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', textDecoration: 'none' }}>
              <Home size={20} />
            </Link>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              style={{ background: 'white', color: 'black', border: 'none', borderRadius: '30px', padding: '0.5rem 1.25rem', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black'; }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="plan" element={<Plan />} />
            {/* Fallbacks for messages/settings for now */}
            <Route path="messages" element={<div style={{color: 'white'}}>Messages Page</div>} />
            <Route path="settings" element={<div style={{color: 'white'}}>Settings Page</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default User;
