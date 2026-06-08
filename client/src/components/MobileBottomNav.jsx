import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, CreditCard, LayoutList, ShoppingBag, UserCircle, MessageCircle, LayoutDashboard, Users, DollarSign } from 'lucide-react';

const MobileBottomNav = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isUser = role === 'user';
  const prefix = isUser ? '/user' : '/admin';

  const userItems = [
    { path: '', label: 'Overview', icon: LayoutDashboard },
    { path: '/plan', label: 'Plan', icon: CreditCard },
    { path: '/messages', label: 'Inbox', icon: MessageCircle },
    { path: '/settings', label: 'My', icon: UserCircle },
  ];

  const adminItems = [
    { path: '', label: 'Overview', icon: LayoutDashboard },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/offers', label: 'Offers', icon: ShoppingBag },
    { path: '/income', label: 'Income', icon: DollarSign },
  ];

  const items = isUser ? userItems : adminItems;

  // Find active index
  const activeIndex = items.findIndex(item => {
    if (item.path === '') {
      return location.pathname === prefix || location.pathname === `${prefix}/`;
    }
    return location.pathname.startsWith(`${prefix}${item.path}`);
  }) === -1 ? 0 : items.findIndex(item => {
    if (item.path === '') return location.pathname === prefix || location.pathname === `${prefix}/`;
    return location.pathname.startsWith(`${prefix}${item.path}`);
  });

  const go = (path) => navigate(prefix + path);

  // Calculate curve center percentage (each item is 25% wide, centers are 12.5, 37.5, 62.5, 87.5)
  const cx = 12.5 + activeIndex * 25;
  const navBgPath = `M 0 20 L ${cx - 12} 20 C ${cx - 8} 20 ${cx - 6} 42 ${cx} 42 C ${cx + 6} 42 ${cx + 8} 20 ${cx + 12} 20 L 100 20 L 100 90 L 0 90 Z`;

  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-nav-bg-container">
        <svg viewBox="0 0 100 90" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path d={navBgPath} fill="var(--bg-secondary)" style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </svg>
      </div>

      <div className="mobile-nav-content" style={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}>
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;
          const Icon = item.icon;
          return (
            <button 
              key={idx}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`} 
              onClick={() => go(item.path)}
              style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ 
                opacity: isActive ? 0 : 1, 
                transition: 'opacity 0.2s', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transform: isActive ? 'translateY(20px)' : 'translateY(0)',
              }}>
                <Icon size={24} strokeWidth={2} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Moving FAB */}
      <button 
        className="mobile-nav-fab" 
        onClick={() => go(items[activeIndex].path)}
        style={{ 
          left: `${cx}%`, 
          backgroundColor: 'var(--accent-primary)', 
          color: 'var(--accent-secondary)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {React.createElement(items[activeIndex].icon, { size: 24, strokeWidth: 2.5 })}
      </button>
    </div>
  );
};

export default MobileBottomNav;
