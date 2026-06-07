import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCircle,
  ShoppingBag,
  DollarSign,
  Megaphone,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Moon,
  Sun
} from 'lucide-react';

import Logo from '../../components/Logo';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Exact Match for /admin
  const isOverview = location.pathname === '/admin' || location.pathname === '/admin/';
  const isProfile = location.pathname === '/admin/profile';
  const isMembers = location.pathname === '/admin/members';
  const isOffers = location.pathname === '/admin/offers';
  const isMessages = location.pathname === '/admin/messages';
  const isIncome = location.pathname === '/admin/income';

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
        <button onClick={() => navigate('/admin')} style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isOverview ? '#27272a' : 'transparent', border: 'none', color: isOverview ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <LayoutDashboard size={20} />
          Overview
        </button>

        {/* Customers */}
        <button onClick={() => navigate('/admin/members')} style={{ padding: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isMembers ? '#27272a' : 'transparent', border: 'none', color: isMembers ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <Users size={20} />
          Customers
        </button>

        {/* Offers */}
        <button onClick={() => navigate('/admin/offers')} style={{ padding: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isOffers ? '#27272a' : 'transparent', border: 'none', color: isOffers ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <ShoppingBag size={20} />
          Offers
        </button>

        {/* Income */}
        <button onClick={() => navigate('/admin/income')} style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isIncome ? '#27272a' : 'transparent', border: 'none', color: isIncome ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <DollarSign size={20} />
          Income
        </button>

        {/* Messages */}
        <button onClick={() => navigate('/admin/messages')} style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', background: isMessages ? '#27272a' : 'transparent', border: 'none', color: isMessages ? 'white' : '#a1a1aa', cursor: 'pointer', borderRadius: '12px', transition: '0.2s', fontWeight: 600 }}>
          <MessageCircle size={20} />
          Messages
        </button>
      </nav>

      {/* Bottom Icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
        <button onClick={() => navigate('/admin/profile')} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'transparent', border: 'none', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
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

export default AdminSidebar;
