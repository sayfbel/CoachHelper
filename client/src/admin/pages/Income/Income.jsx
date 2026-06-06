import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, ArrowUpRight } from 'lucide-react';

const Income = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');

  // Reject Modal state
  const [rejectModal, setRejectModal] = useState({ isOpen: false, orderId: null, reason: '' });

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus, reason = '') => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason })
      });
      if (response.ok) {
        fetchOrders();
        if (newStatus === 'Rejected') {
            setRejectModal({ isOpen: false, orderId: null, reason: '' });
        }
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Network error');
    }
  };

  const confirmedOrders = orders.filter(o => o.status === 'Confirmed');
  const totalRevenue = confirmedOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
  const activeSubs = confirmedOrders.length;
  const totalOrdersCount = orders.length;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (order.customer_email && order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())) || 
      `#ORD-${order.id.toString().padStart(4, '0')}`.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPlan = planFilter === 'All' || order.plan === planFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      matchesDate = orderDate === dateFilter;
    }
    
    return matchesSearch && matchesStatus && matchesPlan && matchesDate;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Revenue & Transactions</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.05', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'white' }}>
            Platform <span style={{ color: 'var(--accent-primary)' }}>Income</span>
          </h1>
        </div>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>Total Revenue</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-title)', color: 'white' }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> Tracking</span>
            <span style={{ color: '#71717a', fontSize: '0.8rem' }}>all time</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>Total Orders</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-title)', color: 'white' }}>{totalOrdersCount}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> Tracking</span>
            <span style={{ color: '#71717a', fontSize: '0.8rem' }}>all time</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>Active Subscriptions</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-title)', color: 'white' }}>{activeSubs}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> +15.1%</span>
            <span style={{ color: '#71717a', fontSize: '0.8rem' }}>from last month</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ backgroundColor: '#18181b', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>Recent Checkout Orders</h2>
        
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: '#27272a', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '0.5rem', fontWeight: 600 }}>Search</label>
            <input type="text" placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #3f3f46', background: '#18181b', color: 'white', outline: 'none' }} />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '0.5rem', fontWeight: 600 }}>Date</label>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #3f3f46', background: '#18181b', color: 'white', outline: 'none' }} />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '0.5rem', fontWeight: 600 }}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #3f3f46', background: '#18181b', color: 'white', outline: 'none' }}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '0.5rem', fontWeight: 600 }}>Plan</label>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #3f3f46', background: '#18181b', color: 'white', outline: 'none' }}>
              <option value="All">All Plans</option>
              <option value="weekly">Weekly Plan</option>
              <option value="monthly">Monthly Plan</option>
              <option value="yearly">Yearly Plan</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 600 }}>Plan</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>No orders match your filters.</td></tr>
              ) : filteredOrders.map((order, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600 }}>#ORD-{order.id.toString().padStart(4, '0')}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'white', fontWeight: 500 }}>{order.customer_name}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: '#a1a1aa' }}>{order.plan}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'white', fontWeight: 600 }}>${parseFloat(order.amount).toFixed(2)}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{
                      background: order.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.1)' : order.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: order.status === 'Confirmed' ? '#22c55e' : order.status === 'Rejected' ? '#ef4444' : '#f59e0b',
                      padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {order.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleStatusChange(order.id, 'Confirmed')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', minWidth: 'auto' }}>Confirm</button>
                        <button onClick={() => setRejectModal({ isOpen: true, orderId: order.id, reason: '' })} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', minWidth: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Reject</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleStatusChange(order.id, 'Pending')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', minWidth: 'auto' }}>Revert to Pending</button>
                      </div>
                    )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="card animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', marginBottom: '1rem' }}>Reject Order</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Please provide a reason for rejecting this payment. The user will see this message.</p>
            <textarea
              className="input-field"
              placeholder="e.g. Invalid payment details..."
              style={{ width: '100%', minHeight: '120px', padding: '1rem', marginBottom: '1.5rem', resize: 'vertical' }}
              value={rejectModal.reason}
              onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setRejectModal({ isOpen: false, orderId: null, reason: '' })}>Cancel</button>
              <button 
                className="btn btn-primary" 
                style={{ background: '#ef4444', color: 'white', border: 'none' }}
                disabled={!rejectModal.reason.trim()}
                onClick={() => handleStatusChange(rejectModal.orderId, 'Rejected', rejectModal.reason)}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
