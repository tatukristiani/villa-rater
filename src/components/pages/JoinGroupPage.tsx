import React, { useState } from 'react';

interface JoinGroupPageProps {
  onBack: () => void;
  onJoin: (joinCode: string) => void;
}

export const JoinGroupPage: React.FC<JoinGroupPageProps> = ({ onBack, onJoin }) => {
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      onJoin(joinCode.trim().toUpperCase());
    }
  };

  return (
    <>
      <button 
        onClick={onBack}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)', 
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '14px'
        }}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>
      
      <div className="glass-card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-gold)' }}>
          Join Group
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
              Enter Join Code
            </label>
            <input
              type="text"
              className="luxury-input"
              placeholder="ABC123"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
              minLength={6}
              maxLength={6}
              style={{ 
                fontSize: '24px', 
                letterSpacing: '5px', 
                textTransform: 'uppercase',
                textAlign: 'center'
              }}
            />
          </div>
          <button type="submit" className="btn-luxury">
            Join Group <i className="bi bi-door-open"></i>
          </button>
        </form>
      </div>
    </>
  );
};