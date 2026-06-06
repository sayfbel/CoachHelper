import React, { useState } from 'react';
import { User, CreditCard, ChevronDown, MoveRight, ArrowUp } from 'lucide-react';

const Overview = () => {
  const [hoveredBar, setHoveredBar] = useState(17);

  // Reusable card style based on screenshot
  const cardStyle = {
    backgroundColor: '#18181b', // Very dark grey
    borderRadius: '24px',
    padding: '1.5rem',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'white'
  };

  const dropdownStyle = {
    background: 'transparent',
    border: '1px solid #3f3f46',
    color: '#a1a1aa',
    padding: '0.4rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  };

  const trendBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    padding: '2px 8px',
    borderRadius: '12px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
    fontSize: '0.7rem',
    fontWeight: 'bold'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1.5rem', height: '100%' }}>
      
      {/* ---------------- CARD 1: OVERVIEW ---------------- */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Overview</h2>
          <button style={dropdownStyle}>
            Last 7 days <ChevronDown size={14} />
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, border: '1px solid #27272a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <User size={16} /> Customers
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em' }}>1,293</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={trendBadgeStyle}><ArrowUp size={10} strokeWidth={3} /> 36.8%</span>
                <span style={{ fontSize: '0.7rem', color: '#71717a' }}>vs last month</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, border: '1px solid #27272a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <CreditCard size={16} /> Balance
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em' }}>256k</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={trendBadgeStyle}><ArrowUp size={10} strokeWidth={3} /> 36.8%</span>
                <span style={{ fontSize: '0.7rem', color: '#71717a' }}>vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avatars Section */}
        <div style={{ marginTop: 'auto' }}>
          <p style={{ color: 'white', fontWeight: 600, marginBottom: '0.2rem' }}>857 new customers today!</p>
          <p style={{ color: '#71717a', fontSize: '0.8rem', marginBottom: '1rem' }}>Send a welcome message to all new customers.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[
                { name: 'Gladyce', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60' },
                { name: 'Elbert', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
                { name: 'Joyce', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
                { name: 'Joyce', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
                { name: 'Joyce', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' }
              ].map((user, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={user.img} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>{user.name}</span>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <MoveRight size={20} />
              </button>
              <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>View all</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- CARD 2: DEVICES ---------------- */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, marginBottom: '2rem' }}>Devices</h2>
        
        <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Donut Chart SVG */}
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#27272a" strokeWidth="12" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00ff00" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="210" strokeLinecap="round" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3f3f46" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="180" strokeLinecap="round" transform="rotate(30, 50, 50)" />
          </svg>
          
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-title)' }}>12.5%</div>
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Mobile</div>
          </div>

          {/* Tooltip on the chart */}
          <div style={{ position: 'absolute', top: '10px', right: '0px', background: 'white', color: 'black', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>Mobile</span>
            <span style={{ color: '#71717a' }}>1,485</span>
            {/* Tooltip triangle */}
            <div style={{ position: 'absolute', bottom: '-4px', left: '10px', width: '0', height: '0', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid white' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa', fontSize: '0.75rem' }}>
              <div style={{ width: '8px', height: '12px', border: '1px solid #a1a1aa', borderRadius: '2px' }}></div> Mobile
            </div>
            <span style={{ fontWeight: 'bold' }}>15.20%</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa', fontSize: '0.75rem' }}>
              <div style={{ width: '12px', height: '10px', border: '1px solid #a1a1aa', borderRadius: '2px' }}></div> Tablet
            </div>
            <span style={{ fontWeight: 'bold' }}>17.1%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa', fontSize: '0.75rem' }}>
              <div style={{ width: '14px', height: '10px', border: '1px solid #a1a1aa', borderRadius: '2px' }}></div> Desktop
            </div>
            <span style={{ fontWeight: 'bold' }}>66.62%</span>
          </div>
        </div>
      </div>

      {/* ---------------- CARD 3: PRODUCT VIEW ---------------- */}
      <div style={{ ...cardStyle, position: 'relative' }}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Product view</h2>
          <button style={dropdownStyle}>
            Last 7 days <ChevronDown size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em', lineHeight: 1 }}>$10.2m</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={trendBadgeStyle}><ArrowUp size={10} strokeWidth={3} /> 36.8%</span>
              <span style={{ fontSize: '0.7rem', color: '#71717a' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Area */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '0.75rem', height: '220px', marginLeft: '200px' }}>
          {[
            { day: 14, val: 50 },
            { day: 15, val: 70 },
            { day: 16, val: 60 },
            { day: 17, val: 100 },
            { day: 19, val: 65 },
            { day: 18, val: 55 },
            { day: 20, val: 80 }
          ].map((bar) => {
            const isHovered = hoveredBar === bar.day;
            return (
              <div 
                key={bar.day} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '36px', position: 'relative' }}
                onMouseEnter={() => setHoveredBar(bar.day)}
              >
                {/* Tooltip for active bar */}
                {isHovered && (
                  <div style={{ position: 'absolute', top: '-30px', background: 'white', color: 'black', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                    2.2m
                  </div>
                )}
                {isHovered && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'transparent', border: '2px solid #00ff00', marginBottom: '2px' }}></div>
                )}
                
                <div style={{ 
                  width: '100%', 
                  height: `${bar.val}%`, 
                  background: isHovered ? '#00ff00' : '#3f3f46', 
                  borderRadius: '6px',
                  transition: 'background 0.3s'
                }}></div>
                <span style={{ fontSize: '0.65rem', color: '#71717a' }}>{bar.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- CARD 4: POPULAR PRODUCTS ---------------- */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, marginBottom: '1.5rem' }}>Popular products</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          {[
            { img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60', name: 'Crypter - NFT UI Kit', price: '$3,250.00', status: 'Active', active: true },
            { img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=100&auto=format&fit=crop&q=60', name: 'Bento Pro 2.0 Illustrations', price: '$7,890.00', status: 'Active', active: true },
            { img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&auto=format&fit=crop&q=60', name: 'Fleet - travel shopping kit', price: '$1,500.00', status: 'Offline', active: false },
            { img: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=100&auto=format&fit=crop&q=60', name: 'SimpleSocial UI Design Kit', price: '$4,750.00', status: 'Active', active: true }
          ].map((prod, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={prod.img} alt={prod.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {prod.name.split(' ').slice(0, 2).join(' ')} <br/>
                  <span style={{ color: '#a1a1aa', fontWeight: 'normal', fontSize: '0.8rem' }}>{prod.name.split(' ').slice(2).join(' ')}</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{prod.price}</span>
                <span style={{ fontSize: '0.7rem', color: prod.active ? '#22c55e' : '#ef4444' }}>{prod.status}</span>
              </div>
            </div>
          ))}
        </div>

        <button style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid #27272a', borderRadius: '12px', color: '#a1a1aa', fontWeight: 600, cursor: 'pointer', marginTop: '1rem', transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#3f3f46' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#27272a' }}>
          All products
        </button>
      </div>

    </div>
  );
};

export default Overview;
