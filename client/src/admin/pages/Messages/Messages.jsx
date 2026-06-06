import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchMessages();
  }, []);

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {isLoading ? (
          <p style={{ color: '#a1a1aa' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: '#a1a1aa' }}>No messages found.</p>
        ) : messages.map((inquiry, idx) => (
          <div key={idx} style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white', marginBottom: '0.2rem' }}>{inquiry.name}</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>{inquiry.email}</p>
                </div>
              </div>
              <span style={{ color: '#71717a', fontSize: '0.8rem' }}>{new Date(inquiry.created_at).toLocaleString()}</span>
            </div>

            <div style={{ background: '#27272a', borderRadius: '12px', padding: '1.5rem', marginTop: '0.5rem' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Subject: {inquiry.subject}
              </div>
              <p style={{ color: '#d4d4d8', lineHeight: 1.6 }}>"{inquiry.message}"</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button style={{ background: 'transparent', border: '1px solid #3f3f46', color: 'white', borderRadius: '30px', padding: '0.5rem 1.25rem', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}>
                Reply via Email
              </button>
              <button style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '30px', padding: '0.5rem 1.25rem', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: '0.2s' }}>
                <CheckCircle size={16} /> Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
