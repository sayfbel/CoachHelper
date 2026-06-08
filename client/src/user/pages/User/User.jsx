import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import UserSidebar from '../../components/UserSidebar';
import { Search, Bell, MessageSquare, Home, Menu, X, Clock } from 'lucide-react';

import Overview from '../Overview/Overview';
import Plan from '../Plan/Plan';
import Seasons from '../Seasons/Seasons';
import SeasonDetail from '../Seasons/SeasonDetail';
import MatchScoresheetForm from '../Seasons/MatchScoresheetForm';
import MobileBottomNav from '../../../components/MobileBottomNav';

const User = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a2d34', color: 'var(--text-primary)' }}>Loading dashboard...</div>;
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
    <div style={{ backgroundColor: 'var(--bg-primary)', height: '100vh', display: 'flex', padding: '1rem', boxSizing: 'border-box', overflow: 'hidden' }}>
      <aside className="desktop-sidebar" style={{ marginRight: '1.5rem', height: '100%' }}>
        <UserSidebar />
      </aside>

      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: 'calc(100% - 1.5rem)', height: '100%' }}>
        {/* Top Bar matching admin screenshot layout */}
        <div className="top-bar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: '40px', marginBottom: '1.5rem', position: 'relative' }}>
          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem', flex: 1, minWidth: 0 }}>
            <Search size={18} color="#a1a1aa" style={{ flexShrink: 0 }} />
            <input type="text" placeholder="Search anything..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', width: '100%', minWidth: '100px' }} />
          </div>

          {/* Right Action Icons (Desktop) */}
          <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Bell size={16} />
            </button>
            <button style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <MessageSquare size={16} />
            </button>
            <Link to="/" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <Home size={20} />
            </Link>
            <button 
              className="btn btn-primary"
              onClick={() => { logout(); navigate('/'); }}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
            >
              Logout
            </button>
          </div>

          {/* Hamburger (Mobile) */}
          <button 
            className="mobile-hamburger" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none', padding: '0.5rem' }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
              <div className="mobile-menu-dropdown animate-fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', width: '80%', maxWidth: '300px', position: 'relative' }}>
                <button onClick={() => setIsMenuOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
                <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>MENU</div>
                <button style={{ background: 'var(--border-color)', border: 'none', borderRadius: '12px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-primary)', cursor: 'pointer', width: '100%', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Bell size={16} /> Notifications
                </button>
                <button style={{ background: 'var(--border-color)', border: 'none', borderRadius: '12px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-primary)', cursor: 'pointer', width: '100%', fontSize: '0.9rem', fontWeight: 600 }}>
                  <MessageSquare size={16} /> Messages
                </button>
                <button 
                  onClick={logout} 
                  className="btn btn-primary"
                  style={{ borderRadius: '12px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', fontSize: '0.9rem', marginTop: '0.5rem' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="scroll-content" style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '2rem' }}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="plan" element={<Plan />} />
            <Route path="seasons" element={<Seasons />} />
            <Route path="seasons/:id" element={<SeasonDetail />} />
            <Route path="seasons/:season_id/match/:match_id" element={<MatchScoresheetForm />} />
            {/* Fallbacks for messages/settings for now */}
            <Route path="messages" element={<div style={{color: 'var(--text-primary)'}}>Messages Page</div>} />
            <Route path="settings" element={<div style={{color: 'var(--text-primary)'}}>Settings Page</div>} />
          </Routes>
        </div>
      </main>
      <MobileBottomNav role="user" />
    </div>
  );
};

export default User;
