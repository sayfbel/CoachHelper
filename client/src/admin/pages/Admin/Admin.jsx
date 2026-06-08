import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, Bell, MessageSquare, Home, Menu, X } from 'lucide-react';

import Overview from '../Overview/Overview';
import Members from '../Members/Members';
import Offers from '../Offers/Offers';
import Messages from '../Messages/Messages';
import Income from '../Income/Income';
import Profile from '../Profile/Profile';
import MobileBottomNav from '../../../components/MobileBottomNav';

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', height: '100vh', display: 'flex', padding: '1rem', boxSizing: 'border-box', overflow: 'hidden' }}>
      <aside className="desktop-sidebar" style={{ marginRight: '1.5rem', height: '100%' }}>
        <AdminSidebar />
      </aside>

      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: 'calc(100% - 1.5rem)', height: '100%' }}>
        {/* Top Bar matching screenshot */}
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
                  onClick={() => { logout(); navigate('/'); }} 
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
            <Route path="members" element={<Members />} />
            <Route path="offers" element={<Offers />} />
            <Route path="messages" element={<Messages />} />
            <Route path="income" element={<Income />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
      <MobileBottomNav role="admin" />
    </div>
  );
};
export default Admin;
