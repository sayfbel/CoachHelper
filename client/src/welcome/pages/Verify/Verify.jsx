import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('Verifying your email...');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setMessage('No token provided');
            setError(true);
            return;
        }
        fetch('http://localhost:3000/api/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200) {
                setMessage(body.message);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage(body.message || 'Verification failed');
                setError(true);
            }
        })
        .catch(err => {
            console.error(err);
            setMessage('Network error. Please try again.');
            setError(true);
        });
    }, [token, navigate]);

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                <h2 style={{ color: error ? 'var(--danger)' : 'var(--accent-primary)', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>
                    {error ? 'Error' : 'Email Verification'}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
                {!error && <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: 'var(--text-muted)' }}>Redirecting to login...</p>}
            </div>
        </div>
    );
};

export default Verify;
