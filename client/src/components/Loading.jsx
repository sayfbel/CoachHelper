import React from 'react';

const Loading = () => {
  return (
    <div className="loader-wrapper">
      {/* Background Basketball Court SVG */}
      <svg className="court-bg-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
        <rect x="40" y="40" width="720" height="720" fill="none" stroke="var(--accent-primary)" strokeWidth="4" rx="16" />
        <line x1="40" y1="400" x2="760" y2="400" stroke="var(--accent-primary)" strokeWidth="4" />
        <circle cx="400" cy="400" r="100" fill="none" stroke="var(--accent-primary)" strokeWidth="4" />
        <rect x="300" y="40" width="200" height="160" fill="none" stroke="var(--accent-primary)" strokeWidth="4" />
        <rect x="300" y="600" width="200" height="160" fill="none" stroke="var(--accent-primary)" strokeWidth="4" />
        <path d="M 200 40 A 200 200 0 0 0 600 40" fill="none" stroke="var(--accent-primary)" strokeWidth="4" />
        <path d="M 200 760 A 200 200 0 0 1 600 760" fill="none" stroke="var(--accent-primary)" strokeWidth="4" />
      </svg>

      {/* Water Fill Circular Loader */}
      <div className="circle-loader">
        <div className="water-wave"></div>
        <div className="water-wave"></div>
      </div>
      
      {/* Loading Text */}
      <div className="loader-text">Loading Data</div>
    </div>
  );
};

export default Loading;
