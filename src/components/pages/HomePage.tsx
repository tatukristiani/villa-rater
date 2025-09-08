import React from 'react';

interface HomePageProps {
  username: string;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ username, onNavigate }) => {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '50px' }}>
        <h1 style={{ color: 'var(--primary-gold)' }}>Welcome, {username}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Create or join a rating group</p>
      </div>
      
      <div className="glass-card" style={{ marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--primary-gold)', marginBottom: '15px' }}>
          <i className="bi bi-plus-circle"></i> Create New Group
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Start a new villa rating session</p>
        <button className="btn-luxury" onClick={() => onNavigate('createGroup')}>
          Create Group
        </button>
      </div>
      
      <div className="glass-card">
        <h3 style={{ color: 'var(--primary-gold)', marginBottom: '15px' }}>
          <i className="bi bi-people"></i> Join Existing Group
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Enter a code to join your friends</p>
        <button className="btn-luxury btn-luxury-secondary" onClick={() => onNavigate('joinGroup')}>
          Join Group
        </button>
      </div>
    </>
  );
};
