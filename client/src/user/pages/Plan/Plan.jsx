import React from 'react';

const Plan = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ color: 'white' }}>
      <h1 className="text-3xl font-bold" style={{ color: 'white' }}>My Plan</h1>
      <div className="card" style={{ background: '#121212', padding: '1.5rem', borderRadius: '16px' }}>
        <p style={{ color: '#a1a1aa' }}>Your assigned plan details will appear here.</p>
      </div>
    </div>
  );
};

export default Plan;
