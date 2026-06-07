import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  MessageCircle,
  UserCircle,
  Settings,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

import Logo from '../../components/Logo';

const UserSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const isOverview = location.pathname === '/user' || location.pathname === '/user/';
  const isPlan = location.pathname === '/user/plan';
  const isMessages = location.pathname === '/user/messages';
  const isSettings = location.pathname === '/user/settings';

  return (
    <div style={{
      width: '260px',
      height: 'calc(100vh - 2rem)',
      backgroundColor: '#121212', // Very dark grey, almost black
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      position: 'sticky',
      top: '1rem',
      color: '#a1a1aa', // Muted text
      overflowY: 'auto'
    }}>
      {/* Logo Area */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Logo />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-title)', letterSpacing: '-0.02em', lineHeight: 1 }}>HOOPCOACH</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
        {/* Dashboard / Overview */}
        <button onClick={() => navigate('/user')} style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isOverview ? '#27272a' : 'transparent', border: 'none', color: isOverview ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <LayoutDashboard size={20} />
          Overview
        </button>

        {/* My Plan */}
        <button onClick={() => navigate('/user/plan')} style={{ padding: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isPlan ? '#27272a' : 'transparent', border: 'none', color: isPlan ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <Dumbbell size={20} />
          My Plan
        </button>

        {/* Messages */}
        <button onClick={() => navigate('/user/messages')} style={{ padding: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isMessages ? '#27272a' : 'transparent', border: 'none', color: isMessages ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <MessageCircle size={20} />
          Messages
        </button>

        {/* Settings */}
        <button onClick={() => navigate('/user/settings')} style={{ padding: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isSettings ? '#27272a' : 'transparent', border: 'none', color: isSettings ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <Settings size={20} />
          Settings
        </button>
      </nav>

      {/* Bottom Icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
        <button onClick={() => navigate('/user/profile')} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'transparent', border: 'none', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <UserCircle size={20} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#27272a', borderRadius: '20px', padding: '4px', width: '40px', alignItems: 'center' }}>
          <button
            onClick={() => setIsDarkMode(true)}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: isDarkMode ? '#3f3f46' : 'transparent', border: 'none', color: isDarkMode ? 'white' : '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Moon size={16} />
          </button>
          <button
            onClick={() => setIsDarkMode(false)}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: !isDarkMode ? '#3f3f46' : 'transparent', border: 'none', color: !isDarkMode ? 'white' : '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', paddingBottom: '4px' }}>
            <Sun size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
