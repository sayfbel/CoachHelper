import React, { useState, useEffect } from 'react';
import { User, CreditCard, ChevronDown, MoveRight, ArrowUp, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PremiumSelect from '../../../components/PremiumSelect';

const Overview = () => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [overviewRange, setOverviewRange] = useState(7);
  const [incomeRange, setIncomeRange] = useState(7);
  
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, offersRes] = await Promise.all([
          fetch('http://localhost:3000/api/users'),
          fetch('http://localhost:3000/api/orders'),
          fetch('http://localhost:3000/api/offers')
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (offersRes.ok) setOffers(await offersRes.json());
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reusable styles
  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
    padding: '1.5rem',
    color: 'var(--text-primary)',
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
    color: 'var(--text-primary)'
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

  const timeOptions = [
    { value: 7, label: 'Last 7 days' },
    { value: 30, label: 'Last month' },
    { value: 365, label: 'Last year' }
  ];

  // --- Calculations ---
  
  // Overview Card Filter
  const overviewStart = new Date();
  overviewStart.setDate(overviewStart.getDate() - overviewRange);
  const overviewOrders = orders.filter(o => o.created_at && new Date(o.created_at) >= overviewStart);
  
  const customerUsers = users.filter(u => u.role !== 'admin');
  const totalCustomers = customerUsers.length; // Users don't have created_at, so we keep total count
  const newCustomers = customerUsers.slice(-5).reverse();
  const totalIncome = overviewOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);
  
  // Income Chart Filter
  let chartData = [];
  if (incomeRange === 7) {
    chartData = Array.from({length: 7}, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const start = new Date(d.setHours(0,0,0,0));
      const end = new Date(d.setHours(23,59,59,999));
      const total = orders.filter(o => o.created_at && new Date(o.created_at) >= start && new Date(o.created_at) <= end)
                          .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
      return { label: d.getDate(), val: total, id: `day-${i}` };
    });
  } else if (incomeRange === 30) {
    chartData = Array.from({length: 4}, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (28 - (i * 7)));
      const start = new Date(d.setHours(0,0,0,0));
      const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23,59,59,999);
      const total = orders.filter(o => o.created_at && new Date(o.created_at) >= start && new Date(o.created_at) <= end)
                          .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
      return { label: `W${i+1}`, val: total, id: `week-${i}` };
    });
  } else if (incomeRange === 365) {
    chartData = Array.from({length: 12}, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      const total = orders.filter(o => o.created_at && new Date(o.created_at) >= start && new Date(o.created_at) <= end)
                          .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
      return { label: d.toLocaleString('default', { month: 'short' }), val: total, id: `month-${i}` };
    });
  }
  
  const maxDailyIncome = Math.max(...chartData.map(d => d.val), 1);

  // Offers Comparison Donut - Map order to actual Offer Name
  const planCounts = {};
  
  // Initialize all offers with 0
  offers.forEach(of => {
    planCounts[of.name] = 0;
  });

  orders.forEach(o => {
    // First try to match by exact price
    let matchingOffer = offers.find(of => parseFloat(of.price) === parseFloat(o.amount));
    // Fallback: match by period (e.g. "monthly" matches "Monthly" or "month")
    if (!matchingOffer && o.plan) {
      const planKeyword = o.plan.toLowerCase().replace('ly', ''); // "monthly" -> "month"
      matchingOffer = offers.find(of => of.period && of.period.toLowerCase().includes(planKeyword));
    }
    const planName = matchingOffer ? matchingOffer.name : (o.plan || 'Unknown');
    planCounts[planName] = (planCounts[planName] || 0) + 1;
  });
  
  const totalPlanOrders = orders.length || 1;
  const sortedPlans = Object.entries(planCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const donutColors = ['#00ff00', '#3b82f6', '#f59e0b'];
  
  const circleCircumference = 2 * Math.PI * 40;
  let currentAngle = -90;
  const donutSegments = sortedPlans.map((plan, idx) => {
    const percentage = plan[1] / totalPlanOrders;
    const dashOffset = circleCircumference - (percentage * circleCircumference);
    const segment = {
      name: plan[0],
      percentage: (percentage * 100).toFixed(1),
      count: plan[1],
      color: donutColors[idx],
      dasharray: circleCircumference,
      dashoffset: dashOffset,
      angle: currentAngle
    };
    currentAngle += (percentage * 360);
    return segment;
  });

  const topSegment = donutSegments.length > 0 ? donutSegments[0] : null;

  // --- SVG Line Chart Path Generation ---
  const N = chartData.length;
  const points = chartData.map((d, i) => {
    const x = N > 0 ? ((i + 0.5) / N) * 100 : 50;
    // Keep dots 5% from top/bottom to prevent stroke clipping
    const y = 95 - (d.val / maxDailyIncome) * 90;
    return { x, y };
  });

  let smoothPath = '';
  if (points.length > 0) {
    smoothPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx = (p1.x + p2.x) / 2;
      smoothPath += ` C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
    }
  }

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>Loading overview data...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem', height: '100%' }}>
      
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Dashboard</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.05', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            System <span style={{ color: 'var(--accent-primary)' }}>Overview</span>
          </h1>
        </div>
      </div>

      <div className="responsive-grid-split" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1.5rem', flex: 1 }}>
      
      {/* ---------------- CARD 1: OVERVIEW ---------------- */}
      <div style={cardStyle}>
        <div className="responsive-header" style={headerStyle}>
          <h2 style={titleStyle}>Overview</h2>
          <div style={{ width: '150px' }}>
            <PremiumSelect 
              options={timeOptions}
              value={overviewRange}
              onChange={setOverviewRange}
              placeholder="Select Range"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="responsive-flex-wrap" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div className="mobile-w-full" style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <User size={16} /> Customers
            </div>
            <div className="responsive-flex-wrap" style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em' }}>{totalCustomers}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={trendBadgeStyle}><ArrowUp size={10} strokeWidth={3} /> 12.5%</span>
                <span style={{ fontSize: '0.7rem', color: '#71717a' }}>vs last month</span>
              </div>
            </div>
          </div>

          <div className="mobile-w-full" style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <CreditCard size={16} /> Total Income
            </div>
            <div className="responsive-flex-wrap" style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em' }}>
                ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={trendBadgeStyle}><ArrowUp size={10} strokeWidth={3} /> 8.4%</span>
                <span style={{ fontSize: '0.7rem', color: '#71717a' }}>vs previous period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avatars Section */}
        <div style={{ marginTop: 'auto' }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.2rem' }}>New customers today</p>
          <p style={{ color: '#71717a', fontSize: '0.8rem', marginBottom: '1rem' }}>Send a welcome message to all new customers.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {newCustomers.map((user, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--text-secondary)" />
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }} className="text-truncate" style={{ maxWidth: '60px', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'center' }}>
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                </div>
              ))}
              {newCustomers.length === 0 && <span style={{ color: '#71717a', fontSize: '0.85rem' }}>No new customers found.</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => navigate('/admin/members')}
                style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid var(--border-hover)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
              >
                <MoveRight size={20} />
              </button>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>View all</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- CARD 2: OFFERS COMPARISON ---------------- */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, marginBottom: '2rem' }}>Offers Comparison</h2>
        
        <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Donut Chart SVG */}
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="12" />
            {donutSegments.map((seg, idx) => (
              <circle 
                key={idx}
                cx="50" cy="50" r="40" 
                fill="transparent" 
                stroke={seg.color} 
                strokeWidth="12" 
                strokeDasharray={seg.dasharray} 
                strokeDashoffset={seg.dashoffset} 
                strokeLinecap="round" 
                transform={`rotate(${seg.angle}, 50, 50)`} 
                style={{ transition: 'all 0.5s ease' }}
              />
            ))}
          </svg>
          
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-title)' }}>
              {topSegment ? `${topSegment.percentage}%` : '0%'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }} className="text-truncate" style={{ maxWidth: '100px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {topSegment ? topSegment.name : 'No Orders'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '2rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          {donutSegments.map((seg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: seg.color, borderRadius: '2px' }}></div> 
                <span className="text-truncate" style={{ maxWidth: '60px' }} title={seg.name}>{seg.name}</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>{seg.percentage}%</span>
            </div>
          ))}
          {donutSegments.length === 0 && <span style={{ color: '#71717a', fontSize: '0.85rem', width: '100%', textAlign: 'center' }}>No order data available</span>}
        </div>
      </div>

      {/* ---------------- CARD 3: INCOME VIEW ---------------- */}
      <div style={{ ...cardStyle, position: 'relative' }}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Income View</h2>
          <div style={{ width: '150px' }}>
            <PremiumSelect 
              options={timeOptions}
              value={incomeRange}
              onChange={setIncomeRange}
              placeholder="Select Range"
            />
          </div>
        </div>

        <div className="mobile-chart-stats" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              ${chartData.reduce((sum, d) => sum + d.val, 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>
                INCOME LAST {incomeRange === 365 ? 'YEAR' : incomeRange === 30 ? 'MONTH' : '7 DAYS'}
              </span>
            </div>
          </div>
        </div>

        {/* Line Chart Area */}
        <div className="mobile-chart-container" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: '220px', marginLeft: '180px' }}>
          
          {/* SVG Line Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '24px', pointerEvents: 'none', zIndex: 1 }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ccff00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {points.length > 0 && (
                <>
                  <path 
                    d={`${smoothPath} L ${points[points.length-1].x} 100 L ${points[0].x} 100 Z`} 
                    fill="url(#lineGradient)" 
                  />
                  <path 
                    d={smoothPath} 
                    fill="none" 
                    stroke="#ccff00" 
                    strokeWidth="3" 
                    vectorEffect="non-scaling-stroke" 
                  />
                </>
              )}
            </svg>
          </div>

          {/* Interaction Zones & Labels */}
          {chartData.map((bar, idx) => {
            const isHovered = hoveredBar === idx;
            const xPos = points[idx] ? points[idx].x : 50;
            const yPos = points[idx] ? points[idx].y : 100;

            return (
              <div 
                key={bar.id} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', height: '100%', zIndex: 2 }}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Interaction Bounds (Matches SVG) */}
                <div style={{ position: 'absolute', top: 0, bottom: '24px', left: 0, right: 0, pointerEvents: 'none' }}>
                  {isHovered && (
                    <div style={{ position: 'absolute', top: `calc(${yPos}% - 30px)`, left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'black', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold', zIndex: 10, whiteSpace: 'nowrap' }}>
                      ${bar.val.toFixed(2)}
                    </div>
                  )}
                  {isHovered && (
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', background: 'rgba(204, 255, 0, 0.3)', zIndex: 1 }}></div>
                  )}
                  {isHovered && (
                    <div style={{ position: 'absolute', top: `${yPos}%`, left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid #ccff00', zIndex: 2 }}></div>
                  )}
                </div>

                <div style={{ flex: 1 }}></div>
                <span style={{ fontSize: '0.65rem', color: '#71717a', height: '24px', display: 'flex', alignItems: 'center' }}>{bar.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- CARD 4: POPULAR OFFERS ---------------- */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, marginBottom: '1.5rem' }}>Popular Offers</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
          {offers.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>No offers found.</div>
          ) : (
            offers.slice(0, 4).map((offer, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={20} color="var(--accent-primary)" />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {offer.name} <br/>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '0.8rem', textTransform: 'capitalize' }}>{offer.period} Billing</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>${offer.price}</span>
                  <span style={{ fontSize: '0.7rem', color: offer.is_popular ? 'var(--accent-primary)' : '#71717a' }}>
                    {offer.is_popular ? 'Popular' : 'Standard'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={() => navigate('/admin/offers')}
          style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', marginTop: '1rem', transition: '0.2s' }} 
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }} 
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)' }}
        >
          All Offers
        </button>
      </div>

      </div>
    </div>
  );
};

export default Overview;
