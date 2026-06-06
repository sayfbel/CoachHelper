import { useLocation, useNavigate, Link } from 'react-router-dom';

const Waiting = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <h2>No order found.</h2>
                    <Link to="/login" className="btn btn-secondary mt-4">Back to Login</Link>
                </div>
            </div>
        );
    }

    const isRejected = order.status === 'Rejected';

    return (
        <div className="container py-section flex flex-col gap-6" style={{ minHeight: '80vh', padding: '4rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    {isRejected ? (
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: '#ef4444', fontSize: '2rem' }}>✕</div>
                    ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: '#f59e0b', fontSize: '2rem' }}>⏳</div>
                    )}
                </div>
                
                <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', color: isRejected ? '#ef4444' : 'white' }}>
                    {isRejected ? 'Payment Rejected' : 'Account Under Review'}
                </h2>
                
                <div style={{ background: '#1c1c1e', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}><strong>Plan Selected:</strong> <span style={{ color: 'white', textTransform: 'capitalize' }}>{order.plan}</span></p>
                    <p style={{ margin: '0', color: 'var(--text-secondary)' }}><strong>Current Status:</strong> <span style={{ color: isRejected ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>{order.status}</span></p>
                </div>

                {isRejected ? (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '8px', color: '#ef4444', textAlign: 'left' }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Reason for Rejection</p>
                        <p style={{ fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>{order.rejection_reason || 'No reason provided by administrator.'}</p>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        Your payment is currently being reviewed by our administrators. Please allow up to <strong style={{ color: 'white' }}>24 hours</strong> for a response.
                    </p>
                )}

                <div style={{ marginTop: '2.5rem' }}>
                    <Link to="/login" className="btn btn-secondary w-full" style={{ padding: '0.75rem' }}>Sign Out</Link>
                </div>
            </div>
        </div>
    );
};

export default Waiting;
