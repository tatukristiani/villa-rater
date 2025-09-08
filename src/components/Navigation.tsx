import React from 'react';

interface NavigationProps {
  onLogout: () => void;
  show: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ onLogout, show }) => {
  if (!show) return null;

  return (
    <nav className="luxury-nav">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: 'var(--primary-gold)', fontFamily: 'Playfair Display, serif', margin: 0 }}>
          <i className="bi bi-gem"></i> Villa Rater
        </h4>
        <button 
          onClick={onLogout}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </nav>
  );
};