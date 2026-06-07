import React, { useState, useEffect, useRef } from 'react';
import { Users, Search, MoreVertical, Activity, UserX, UserCheck, Shield, Trash2, StopCircle, RotateCcw, PlusCircle, X } from 'lucide-react';
import PremiumSelect from '../../../components/PremiumSelect';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedUserForOffer, setSelectedUserForOffer] = useState(null);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState('');
  const dropdownRef = useRef(null);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active', color: 'var(--success)' },
    { value: 'expired', label: 'Expired', color: 'var(--danger)' },
    { value: 'inactive', label: 'Inactive', color: '#f59e0b' },
    { value: 'admin', label: 'Admin', color: 'var(--accent-primary)' }
  ];

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/offers');
      if (response.ok) {
        const data = await response.json();
        setAvailableOffers(data);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchOffers();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actions
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (e) {
      console.error(e);
    }
    setOpenDropdownId(null);
  };

  const handleEndOffer = async (id) => {
    if (!window.confirm("Are you sure you want to end this user's offer?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}/end-offer`, { method: 'PUT' });
      if (res.ok) {
        fetchMembers();
      } else {
        alert('Failed to end offer');
      }
    } catch (e) {
      console.error(e);
    }
    setOpenDropdownId(null);
  };

  const handleRestartOffer = async (id) => {
    if (!window.confirm("Are you sure you want to restart this user's offer?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}/restart-offer`, { method: 'PUT' });
      if (res.ok) {
        fetchMembers();
      } else {
        alert('Failed to restart offer');
      }
    } catch (e) {
      console.error(e);
    }
    setOpenDropdownId(null);
  };

  const openAddOfferModal = (user) => {
    setSelectedUserForOffer(user);
    if (availableOffers.length > 0) setSelectedOffer(availableOffers[0].id);
    setIsOfferModalOpen(true);
    setOpenDropdownId(null);
  };

  const submitAddOffer = async () => {
    if (!selectedOffer || !selectedUserForOffer) return;
    const offer = availableOffers.find(o => o.id.toString() === selectedOffer.toString());
    if (!offer) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${selectedUserForOffer.id}/add-offer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_name: offer.name, period: offer.period })
      });
      if (res.ok) {
        setIsOfferModalOpen(false);
        fetchMembers();
      } else {
        alert('Failed to add offer');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Determine user status
  const getUserStatus = (user) => {
    if (user.role === 'admin') return 'Admin';
    if (!user.plan_end_date) return 'Inactive';
    const endDate = new Date(user.plan_end_date);
    if (endDate > new Date()) return 'Active';
    return 'Expired';
  };

  const processedMembers = members.map(m => ({
    ...m,
    computedStatus: getUserStatus(m)
  }));

  // Stats
  const totalUsers = members.length;
  const activeCount = processedMembers.filter(m => m.computedStatus === 'Active').length;
  const inactiveCount = processedMembers.filter(m => m.computedStatus === 'Inactive' || m.computedStatus === 'Expired').length;
  const adminCount = processedMembers.filter(m => m.role === 'admin').length;

  const filteredMembers = processedMembers.filter(member => {
    const matchesSearch = searchTerm === '' || 
      (member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.club_name && member.club_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = member.computedStatus.toLowerCase() === statusFilter.toLowerCase();
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>User Management</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.05', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            Platform <span style={{ color: 'var(--accent-primary)' }}>Members</span>
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Total Users */}
        <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#121212', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'var(--transition)' }} className="card-hover">
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--accent-primary)', filter: 'blur(50px)', opacity: 0.15, borderRadius: '50%' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <span style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Users</span>
            <div style={{ background: 'rgba(204, 255, 0, 0.1)', padding: '0.6rem', borderRadius: '14px', border: '1px solid rgba(204, 255, 0, 0.2)' }}>
              <Users size={20} color="var(--accent-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: 'white', lineHeight: 1, position: 'relative', zIndex: 1 }}>{totalUsers}</div>
        </div>
        
        {/* Active vs Inactive Ring */}
        <div style={{ backgroundColor: '#121212', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', transition: 'var(--transition)' }} className="card-hover">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            <span style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Active vs Inactive</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.85rem', fontWeight: 500 }}>Active</span>
                </div>
                <span style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>{activeCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', boxShadow: '0 0 10px var(--danger)' }}></div>
                  <span style={{ color: '#d4d4d8', fontSize: '0.85rem', fontWeight: 500 }}>Inactive</span>
                </div>
                <span style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>{inactiveCount}</span>
              </div>
            </div>
          </div>
          <div style={{ 
            width: '90px', height: '90px', borderRadius: '50%', 
            background: `conic-gradient(var(--success) ${totalUsers === 0 ? 0 : (activeCount/(activeCount+inactiveCount))*100}%, var(--danger) 0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0,0,0,0.4)',
            flexShrink: 0
          }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.05)' }}>
               <Activity size={20} color="#a1a1aa" />
            </div>
          </div>
        </div>

        {/* Platform Admins */}
        <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#121212', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'var(--transition)' }} className="card-hover">
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', background: '#3b82f6', filter: 'blur(50px)', opacity: 0.15, borderRadius: '50%' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <span style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Platform Admins</span>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.6rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Shield size={20} color="white" />
            </div>
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: 'white', lineHeight: 1, position: 'relative', zIndex: 1 }}>{adminCount}</div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search members by name, email, or club..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          </div>
          <div style={{ width: '150px' }}>
            <PremiumSelect 
              options={statusOptions} 
              value={statusFilter} 
              onChange={setStatusFilter} 
              placeholder="All Status" 
            />
          </div>
        </div>

        {/* Premium Data Table */}
        <div style={{ overflowX: 'visible', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Member</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Club/Team</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>Loading members...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>No members match your criteria.</td></tr>
              ) : filteredMembers.map((member, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: member.role === 'admin' ? 'rgba(204, 255, 0, 0.02)' : 'transparent' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name || 'Unnamed'} {member.role === 'admin' && '(Admin)'}</span>
                      <span className="text-truncate" title={member.email} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{member.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{member.club_name || 'N/A'}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      background: member.role === 'admin' ? 'rgba(204, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                      color: member.role === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                      padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600 
                    }}>
                      {member.role === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {member.role !== 'admin' && (
                          <div style={{ 
                            width: '8px', height: '8px', borderRadius: '50%', 
                            background: member.computedStatus === 'Active' ? 'var(--success)' : 
                                        member.computedStatus === 'Expired' ? 'var(--danger)' : '#f59e0b'
                          }} />
                        )}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{member.computedStatus}</span>
                      </div>
                      {member.role !== 'admin' && (
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px' }}>
                          {member.plan_start_date && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Started: {new Date(member.plan_start_date).toLocaleDateString()}</span>
                          )}
                          {member.plan_end_date && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ends: {new Date(member.plan_end_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', position: 'relative' }}>
                    {member.role !== 'admin' && (
                      <div ref={openDropdownId === member.id ? dropdownRef : null}>
                        <button 
                          onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                          style={{ background: openDropdownId === member.id ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '50%', padding: '0.3rem', transition: '0.2s' }}>
                          <MoreVertical size={18} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openDropdownId === member.id && (
                          <div style={{
                            position: 'absolute',
                            right: '40px',
                            top: '20px',
                            background: '#18181b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            padding: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            zIndex: 50,
                            minWidth: '160px',
                            textAlign: 'left'
                          }}>
                            <button onClick={() => openAddOfferModal(member)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#d4d4d8', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(204,255,0,0.1)'; e.currentTarget.style.color = 'var(--accent-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#d4d4d8'; }}>
                              <PlusCircle size={14} /> Add Offer
                            </button>
                            <button onClick={() => handleRestartOffer(member.id)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#d4d4d8', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}>
                              <RotateCcw size={14} /> Restart Offer
                            </button>
                            <button onClick={() => handleEndOffer(member.id)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#d4d4d8', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}>
                              <StopCircle size={14} /> End Offer
                            </button>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                            <button onClick={() => handleDelete(member.id)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--danger)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}>
                              <Trash2 size={14} /> Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Offer Modal */}
      {isOfferModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card animate-fade-in" style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
            <button onClick={() => setIsOfferModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', color: 'white', fontWeight: 800 }}>Add Offer</h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '0.25rem' }}>Select an offer to assign to {selectedUserForOffer?.name}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d4d4d8' }}>Select Offer</label>
              <PremiumSelect 
                options={availableOffers.map(offer => ({
                  value: offer.id.toString(),
                  label: `${offer.name} ($${offer.price} / ${offer.period})`
                }))}
                value={selectedOffer?.toString() || ''}
                onChange={(val) => setSelectedOffer(val)}
                placeholder="Select an offer"
              />
            </div>

            <button onClick={submitAddOffer} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Apply Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
