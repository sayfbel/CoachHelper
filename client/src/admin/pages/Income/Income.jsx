import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, ArrowUpRight, Search, Calendar, Filter, Layers, Trash2, Plus } from 'lucide-react';
import PremiumSelect from '../../../components/PremiumSelect';
import PremiumDatePicker from '../../../components/PremiumDatePicker';

const Income = () => {
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');

  // Reject Modal state
  const [rejectModal, setRejectModal] = useState({ isOpen: false, orderId: null, reason: '' });

  // Payment Methods Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({ name: '', rib: '' });

  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending', color: '#f59e0b' },
    { value: 'Confirmed', label: 'Confirmed', color: '#22c55e' },
    { value: 'Rejected', label: 'Rejected', color: '#ef4444' }
  ];

  const planOptions = [
    { value: 'All', label: 'All Plans' },
    { value: 'weekly', label: 'Weekly Plan' },
    { value: 'monthly', label: 'Monthly Plan' },
    { value: 'yearly', label: 'Yearly Plan' }
  ];

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

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPaymentMethods();
  }, []);

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPaymentMethod)
      });
      if (response.ok) {
        fetchPaymentMethods();
        setNewPaymentMethod({ name: '', rib: '' });
      } else {
        alert('Failed to add payment method');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/payment-methods/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPaymentMethods();
      } else {
        alert('Failed to delete payment method');
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Revenue & Transactions</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.05', fontFamily: 'var(--font-title)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Platform <span style={{ color: 'var(--accent-primary)' }}>Income</span>
          </h1>
        </div>
        <button onClick={() => setPaymentModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}>
          <CreditCard size={18} /> Manage Payment Methods
        </button>
      </div>

      {/* Top Stats */}
      <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Total Revenue</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> Tracking</span>
            <span style={{ color: '#71717a', fontSize: '0.8rem' }}>all time</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Total Orders</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>{totalOrdersCount}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> Tracking</span>
            <span style={{ color: '#71717a', fontSize: '0.8rem' }}>all time</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Active Subscriptions</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>{activeSubs}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> +15.1%</span>
            <span style={{ color: '#71717a', fontSize: '0.8rem' }}>from last month</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Recent Checkout Orders</h2>
        
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
              <Search size={14} color="var(--accent-primary)" /> Search Orders
            </label>
            <div style={{ position: 'relative' }}>
              <input type="text" className="input-field" placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
              <Calendar size={14} color="var(--accent-primary)" /> Order Date
            </label>
            <PremiumDatePicker value={dateFilter} onChange={setDateFilter} placeholder="Any Date" />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
              <Filter size={14} color="var(--accent-primary)" /> Status Filter
            </label>
            <PremiumSelect options={statusOptions} value={statusFilter} onChange={setStatusFilter} placeholder="Select Status" />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
              <Layers size={14} color="var(--accent-primary)" /> Plan Type
            </label>
            <PremiumSelect options={planOptions} value={planFilter} onChange={setPlanFilter} placeholder="Select Plan" />
          </div>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Plan</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders match your filters.</td></tr>
              ) : filteredOrders.map((order, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>#ORD-{order.id.toString().padStart(4, '0')}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <span className="text-truncate" title={order.customer_name} style={{ maxWidth: '150px' }}>{order.customer_name}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>
                    <span className="text-truncate" title={order.plan} style={{ maxWidth: '100px' }}>{order.plan}</span>
                    {order.receipt_image && (
                      <a href={`http://localhost:3000${order.receipt_image}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.25rem', textDecoration: 'underline' }}>View Receipt</a>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>${parseFloat(order.amount).toFixed(2)}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{
                      background: order.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.1)' : order.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: order.status === 'Confirmed' ? '#22c55e' : order.status === 'Rejected' ? '#ef4444' : '#f59e0b',
                      padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
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
                style={{ background: '#ef4444', color: 'var(--text-primary)', border: 'none' }}
                disabled={!rejectModal.reason.trim()}
                onClick={() => handleStatusChange(rejectModal.orderId, 'Rejected', rejectModal.reason)}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Fullscreen Modal */}
      {paymentModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '2rem' }}>
          <div className="card animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '800px', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <button 
              onClick={() => setPaymentModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
            >×</button>
            
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Payment Methods
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage the payment methods available for users during checkout.</p>
            
            <form onSubmit={handleAddPaymentMethod} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(204, 255, 0, 0.1)' }}>
              <div style={{ flex: 1 }}>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Method Name (e.g. Bank Transfer)</label>
                <input type="text" className="input-field" value={newPaymentMethod.name} onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})} required placeholder="Enter method name" />
              </div>
              <div style={{ flex: 2 }}>
                <label className="block text-sm font-semibold text-secondary mb-1.5" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>RIB / Account Details</label>
                <input type="text" className="input-field" value={newPaymentMethod.rib} onChange={(e) => setNewPaymentMethod({...newPaymentMethod, rib: e.target.value})} required placeholder="0000 0000 0000 0000 0000" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '44px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Add
              </button>
            </form>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Methods</h3>
              {paymentMethods.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>No payment methods added yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {paymentMethods.map(method => (
                    <div key={method.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{method.name}</div>
                        <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', letterSpacing: '1px', fontFamily: 'monospace' }}>{method.rib}</div>
                      </div>
                      <button onClick={() => handleDeletePaymentMethod(method.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
