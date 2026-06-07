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
    backgroundColor: '#121212',
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

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#a1a1aa' }}>Loading overview data...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1.5rem', height: '100%' }}>
      
      {/* ---------------- CARD 1: OVERVIEW ---------------- */}
      <div style={cardStyle}>
        <div style={headerStyle}>
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
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, border: '1px solid #27272a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <User size={16} /> Customers
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em' }}>{totalCustomers}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={trendBadgeStyle}><ArrowUp size={10} strokeWidth={3} /> 12.5%</span>
                <span style={{ fontSize: '0.7rem', color: '#71717a' }}>vs last month</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, border: '1px solid #27272a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <CreditCard size={16} /> Total Income
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
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
          <p style={{ color: 'white', fontWeight: 600, marginBottom: '0.2rem' }}>New customers today</p>
          <p style={{ color: '#71717a', fontSize: '0.8rem', marginBottom: '1rem' }}>Send a welcome message to all new customers.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {newCustomers.map((user, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="#a1a1aa" />
                  </div>
                  <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }} className="text-truncate" style={{ maxWidth: '60px', color: '#a1a1aa', fontSize: '0.75rem', textAlign: 'center' }}>
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                </div>
              ))}
              {newCustomers.length === 0 && <span style={{ color: '#71717a', fontSize: '0.85rem' }}>No new customers found.</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => navigate('/admin/members')}
                style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#3f3f46'; }}
              >
                <MoveRight size={20} />
              </button>
              <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>View all</span>
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
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#27272a" strokeWidth="12" />
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
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }} className="text-truncate" style={{ maxWidth: '100px', margin: '0 auto', color: '#a1a1aa', fontSize: '0.85rem' }}>
              {topSegment ? topSegment.name : 'No Orders'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '2rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          {donutSegments.map((seg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'capitalize' }}>
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

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
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

        {/* Bar Chart Area */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: incomeRange === 365 ? '0.2rem' : '0.75rem', height: '220px', marginLeft: '180px' }}>
          {chartData.map((bar, idx) => {
            const isHovered = hoveredBar === idx;
            const barHeight = Math.max((bar.val / maxDailyIncome) * 100, 5); // min 5% height
            return (
              <div 
                key={bar.id} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: '36px', position: 'relative' }}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip for active bar */}
                {isHovered && (
                  <div style={{ position: 'absolute', top: '-30px', background: 'white', color: 'black', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold', zIndex: 10, whiteSpace: 'nowrap' }}>
                    ${bar.val.toFixed(2)}
                  </div>
                )}
                {isHovered && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'transparent', border: '2px solid var(--accent-primary)', marginBottom: '2px' }}></div>
                )}
                
                <div style={{ 
                  width: '100%', 
                  height: `${barHeight}%`, 
                  background: isHovered ? 'var(--accent-primary)' : '#3f3f46', 
                  borderRadius: '6px',
                  transition: 'background 0.3s, height 0.3s ease'
                }}></div>
                <span style={{ fontSize: '0.65rem', color: '#71717a' }}>{bar.label}</span>
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
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>No offers found.</div>
          ) : (
            offers.slice(0, 4).map((offer, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={20} color="var(--accent-primary)" />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {offer.name} <br/>
                    <span style={{ color: '#a1a1aa', fontWeight: 'normal', fontSize: '0.8rem', textTransform: 'capitalize' }}>{offer.period} Billing</span>
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
          style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid #27272a', borderRadius: '12px', color: '#a1a1aa', fontWeight: 600, cursor: 'pointer', marginTop: '1rem', transition: '0.2s' }} 
          onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#3f3f46' }} 
          onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#27272a' }}
        >
          All Offers
        </button>
      </div>

    </div>
  );
};

export default Overview;
