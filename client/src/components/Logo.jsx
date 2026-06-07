import React from 'react';

const Logo = ({ width = 40, height = 40, style, className }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className}>
      {/* Trend Arrow */}
      <path d="M15 48 L35 22 L55 42 L85 12" stroke="var(--accent-primary)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 12 L85 12 L85 37" stroke="var(--accent-primary)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hoop Rim */}
      <path d="M10 58 L90 58" stroke="var(--accent-primary)" strokeWidth="8" strokeLinecap="round" />
      {/* Net */}
      <path d="M20 58 L35 95 M40 58 L50 95 M60 58 L50 95 M80 58 L65 95" stroke="var(--accent-primary)" strokeWidth="5" strokeLinecap="round" />
      <path d="M27 76 L73 76" stroke="var(--accent-primary)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;
