import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const PremiumSelect = ({ options, value, onChange, placeholder = 'Select an option' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: isOpen ? 'var(--bg-primary)' : 'var(--bg-secondary)',
          borderColor: isOpen ? 'var(--accent-primary)' : 'var(--border-color)',
          boxShadow: isOpen ? '0 0 0 1px var(--accent-primary), 0 0 15px rgba(204, 255, 0, 0.05)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedOption?.color && (
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: selectedOption.color }} />
          )}
          {selectedOption?.icon && selectedOption.icon}
          <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          color="var(--text-secondary)"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '100%',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            padding: '0.5rem',
            zIndex: 50,
            maxHeight: '250px',
            overflowY: 'auto',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      background: isSelected ? 'rgba(204, 255, 0, 0.1)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'var(--border-color)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Checkmark placeholder to keep alignment */}
                    <div style={{ width: '16px', display: 'flex', justifyContent: 'center' }}>
                      {isSelected && <Check size={14} color="var(--accent-primary)" />}
                    </div>

                    {/* Colored dot (like the Highlight Color image) */}
                    {option.color && (
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: option.color, border: '1px solid rgba(255,255,255,0.1)' }} />
                    )}

                    {/* Icon */}
                    {option.icon && option.icon}

                    <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {option.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PremiumSelect;
