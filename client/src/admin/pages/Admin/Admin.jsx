import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, Bell, MessageSquare, Home } from 'lucide-react';

import Overview from '../Overview/Overview';
import Members from '../Members/Members';
import Offers from '../Offers/Offers';
import Messages from '../Messages/Messages';
import Income from '../Income/Income';
import Profile from '../Profile/Profile';

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', padding: '1rem', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <aside style={{ marginRight: '1.5rem' }}>
        <AdminSidebar />
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: 'calc(100% - 1.5rem)' }}>
        {/* Top Bar matching screenshot */}
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
            <Route path="members" element={<Members />} />
            <Route path="offers" element={<Offers />} />
            <Route path="messages" element={<Messages />} />
            <Route path="income" element={<Income />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
export default Admin;
