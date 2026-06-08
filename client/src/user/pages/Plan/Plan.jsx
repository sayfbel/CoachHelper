import React from 'react';

const Plan = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ color: 'var(--text-primary)' }}>
      <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Plan</h1>
      <div className="card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Your assigned plan details will appear here.</p>
      </div>
    </div>
  );
};

export default Plan;
