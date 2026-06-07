import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, MessageSquare, Clock, ArrowLeftRight } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Replied', 'NotReplied'

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkResolved = async (id) => {
    // Optimistically update the UI to mark as resolved/replied
    // In a real scenario, make a PUT request to the backend
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Resolved' } : m));
    
    try {
      await fetch(`http://localhost:3000/api/messages/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const totalMessages = messages.length;
  // We'll treat status 'Resolved' as 'Replied'
  const totalReplied = messages.filter(m => m.status === 'Resolved' || m.is_resolved === 1).length;
  const totalNotReplied = totalMessages - totalReplied;

  const toggleFilter = (filterName) => {
    if (activeFilter === filterName) {
      setActiveFilter('All');
    } else {
      setActiveFilter(filterName);
    }
  };

  const filteredMessages = messages.filter(m => {
    const isReplied = m.status === 'Resolved' || m.is_resolved === 1;
    if (activeFilter === 'Replied') return isReplied;
    if (activeFilter === 'NotReplied') return !isReplied;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Contact Form Inquiries</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.05', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'white' }}>
            Client <span style={{ color: 'var(--accent-primary)' }}>Messages</span>
          </h1>
        </div>
      </div>

      {/* Interactive Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Total Messages (Not Clickable) */}
        <div style={{ backgroundColor: '#121212', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'var(--transition)' }} className="card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Messages</span>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.6rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <MessageSquare size={20} color="white" />
            </div>
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: 'white', lineHeight: 1 }}>{totalMessages}</div>
        </div>

        {/* Total Replied (Clickable Filter) */}
        <div 
          onClick={() => toggleFilter('Replied')}
          style={{ 
            backgroundColor: activeFilter === 'Replied' ? 'rgba(34, 197, 94, 0.05)' : '#121212', 
            borderRadius: '24px', padding: '1.75rem', 
            border: activeFilter === 'Replied' ? '1px solid var(--success)' : '1px solid rgba(255,255,255,0.05)', 
            display: 'flex', flexDirection: 'column', gap: '1rem', 
            transition: 'var(--transition)', cursor: 'pointer',
            boxShadow: activeFilter === 'Replied' ? '0 0 25px rgba(34, 197, 94, 0.1)' : 'none'
          }} 
          className="card-hover"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: activeFilter === 'Replied' ? 'var(--success)' : '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Replied</span>
            <div style={{ background: activeFilter === 'Replied' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)', padding: '0.6rem', borderRadius: '14px', border: activeFilter === 'Replied' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255,255,255,0.1)' }}>
              <CheckCircle size={20} color={activeFilter === 'Replied' ? 'var(--success)' : 'white'} />
            </div>
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: activeFilter === 'Replied' ? 'var(--success)' : 'white', lineHeight: 1 }}>{totalReplied}</div>
          {activeFilter === 'Replied' && <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold' }}>• Filter Active</span>}
        </div>

        {/* Total Not Replied (Clickable Filter) */}
        <div 
          onClick={() => toggleFilter('NotReplied')}
          style={{ 
            backgroundColor: activeFilter === 'NotReplied' ? 'rgba(239, 68, 68, 0.05)' : '#121212', 
            borderRadius: '24px', padding: '1.75rem', 
            border: activeFilter === 'NotReplied' ? '1px solid var(--danger)' : '1px solid rgba(255,255,255,0.05)', 
            display: 'flex', flexDirection: 'column', gap: '1rem', 
            transition: 'var(--transition)', cursor: 'pointer',
            boxShadow: activeFilter === 'NotReplied' ? '0 0 25px rgba(239, 68, 68, 0.1)' : 'none'
          }} 
          className="card-hover"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: activeFilter === 'NotReplied' ? 'var(--danger)' : '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Not Replied Yet</span>
            <div style={{ background: activeFilter === 'NotReplied' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)', padding: '0.6rem', borderRadius: '14px', border: activeFilter === 'NotReplied' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255,255,255,0.1)' }}>
              <Clock size={20} color={activeFilter === 'NotReplied' ? 'var(--danger)' : 'white'} />
            </div>
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-title)', color: activeFilter === 'NotReplied' ? 'var(--danger)' : 'white', lineHeight: 1 }}>{totalNotReplied}</div>
          {activeFilter === 'NotReplied' && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 'bold' }}>• Filter Active</span>}
        </div>
      </div>

      {/* Messages List Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeftRight size={18} color="var(--accent-primary)" /> Inbox Stream {activeFilter !== 'All' && <span style={{ fontSize: '0.8rem', color: '#a1a1aa', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>Filtered by: {activeFilter}</span>}
        </h2>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#121212', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)', color: '#a1a1aa' }}>
            No messages found {activeFilter !== 'All' && 'for this filter'}.
          </div>
        ) : filteredMessages.map((inquiry, idx) => {
          const isReplied = inquiry.status === 'Resolved' || inquiry.is_resolved === 1;
          return (
            <div key={inquiry.id || idx} style={{ 
              backgroundColor: '#121212', 
              borderRadius: '24px', 
              padding: '2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem', 
              border: isReplied ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {isReplied && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--success)' }}></div>}
              
              {/* Message Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isReplied ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isReplied ? 'var(--success)' : 'white' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{inquiry.name}</h3>
                    <p className="text-truncate" title={inquiry.email} style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>{inquiry.email}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 500 }}>{new Date(inquiry.created_at).toLocaleString()}</span>
                  {isReplied ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '20px' }}><CheckCircle size={12}/> REPLIED</span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '20px' }}><Clock size={12}/> PENDING</span>
                  )}
                </div>
              </div>

              {/* Message Body (Modern Format) */}
              <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.1)', padding: '1.25rem 1.5rem', borderRadius: '0 12px 12px 0' }}>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>
                  {inquiry.subject}
                </div>
                <p style={{ color: '#d4d4d8', lineHeight: 1.7, fontSize: '0.95rem' }}>{inquiry.message}</p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button style={{ background: 'transparent', border: '1px solid #3f3f46', color: 'white', borderRadius: '30px', padding: '0.6rem 1.5rem', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--transition)' }} className="btn-secondary">
                  Reply via Email
                </button>
                {!isReplied && (
                  <button onClick={() => handleMarkResolved(inquiry.id)} style={{ background: 'var(--success)', color: 'black', border: 'none', borderRadius: '30px', padding: '0.6rem 1.5rem', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }} className="btn-primary">
                    <CheckCircle size={16} /> Mark as Replied
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
