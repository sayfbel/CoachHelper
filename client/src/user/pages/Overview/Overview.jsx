import React from 'react';

const Overview = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ color: 'white' }}>
      <h1 className="text-3xl font-bold" style={{ color: 'white' }}>User Dashboard</h1>
      <div className="card" style={{ background: '#121212', padding: '1.5rem', borderRadius: '16px' }}>
        <h2 className="text-xl font-bold mb-4">Welcome, User!</h2>
        <p style={{ color: '#a1a1aa' }}>This is the regular user protected area. You have standard access permissions.</p>
      </div>
    </div>
  );
};

export default Overview;
