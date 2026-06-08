import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Check, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, description, onConfirm, onCancel }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999, // very high z-index to ensure it sits over everything
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2.5rem',
        maxWidth: '450px',
        width: '90%',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        animation: 'slideUp 0.3s ease-out'
      }}>
        
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(204, 255, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <AlertTriangle size={32} color="var(--accent-primary)" />
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          fontFamily: 'var(--font-title)'
        }}>
          {title}
        </h2>
        
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          marginBottom: '2.5rem'
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button 
            className="btn btn-secondary"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            <X size={18} /> No, Cancel
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            <Check size={18} /> Yes, Proceed
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmModal;
