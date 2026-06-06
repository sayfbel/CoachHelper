import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Notification = ({ isVisible, message, type = 'success', onClose, autoCloseTime = 4000 }) => {
  
  useEffect(() => {
    if (isVisible && autoCloseTime) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseTime, onClose]);

  if (!isVisible) return null;

  const isError = type === 'error';
  const iconColor = isError ? 'var(--danger)' : 'var(--success)';
  const bgColor = isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)';
  const borderColor = isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)';

  const notificationContent = (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: '#18181b', // dark background
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bgColor,
        borderRadius: '50%',
        padding: '0.4rem'
      }}>
        {isError ? (
          <AlertCircle size={20} color={iconColor} />
        ) : (
          <CheckCircle2 size={20} color={iconColor} />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '1rem' }}>
        <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
          {isError ? 'Error' : 'Success'}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {message}
        </span>
      </div>

      <button 
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={16} />
      </button>
    </div>
  );

  return createPortal(notificationContent, document.body);
};

export default Notification;
