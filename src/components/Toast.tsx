import React, { useEffect } from 'react';

interface ToastProps {
  title: string;
  message: string;
  type?: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ title, message, type = 'success', show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast-luxury">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <i 
          className={type === 'error' ? 'bi bi-exclamation-circle-fill' : 'bi bi-check-circle-fill'}
          style={{ 
            color: type === 'error' ? '#f5576c' : 'var(--primary-gold)', 
            fontSize: '24px', 
            marginRight: '15px' 
          }}
        />
        <div>
          <strong>{title}</strong>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>{message}</p>
        </div>
      </div>
    </div>
  );
};