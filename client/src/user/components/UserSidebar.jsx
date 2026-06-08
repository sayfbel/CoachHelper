import React, { useState, useEffect } from 'react';
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
  LogOut,
  Trophy
} from 'lucide-react';

import Logo from '../../components/Logo';

const UserSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Set initial theme and handle theme toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const isOverview = location.pathname === '/user' || location.pathname === '/user/';
  const isSeasons = location.pathname.startsWith('/user/seasons');
  const isPlan = location.pathname === '/user/plan';
  const isMessages = location.pathname === '/user/messages';
  const isSettings = location.pathname === '/user/settings';

  const NavButton = ({ path, label, icon: Icon, isActive }) => (
    <button 
      onClick={() => navigate(path)} 
      style={{ 
        padding: '0.75rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        background: isActive ? 'var(--bg-active)' : 'transparent', 
        border: 'none', 
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', 
        cursor: 'pointer', 
        borderRadius: '12px', 
        transition: '0.2s', 
        fontWeight: 600 
      }}
    >
      <Icon size={20} />
      <span className="sidebar-text">{label}</span>
    </button>
  );

  return (
    <div className="sidebar-container" style={{
      width: '260px',
      height: 'calc(100vh - 2rem)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      position: 'sticky',
      top: '1rem',
      color: 'var(--text-secondary)',
      overflowY: 'auto'
    }}>
      {/* Logo Area */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Logo />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="sidebar-text" style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-title)', letterSpacing: '-0.02em', lineHeight: 1 }}>HOOPCOACH</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
        <NavButton path="/user" label="Overview" icon={LayoutDashboard} isActive={isOverview} />
        <NavButton path="/user/seasons" label="Seasons" icon={Trophy} isActive={isSeasons} />
        <NavButton path="/user/plan" label="My Plan" icon={Dumbbell} isActive={isPlan} />
        <NavButton path="/user/messages" label="Messages" icon={MessageCircle} isActive={isMessages} />
        <NavButton path="/user/settings" label="Settings" icon={Settings} isActive={isSettings} />
      </nav>

      {/* Bottom Icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
        <button onClick={() => navigate('/user/profile')} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <UserCircle size={20} />
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
