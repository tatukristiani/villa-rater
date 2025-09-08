import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '50px', marginTop: '100px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          background: 'linear-gradient(135deg, var(--primary-gold), #f4e4c1)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          Villa Rater
        </h1>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Luxury Villa Rating Experience</p>
      </div>
      
      <div className="glass-card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-gold)' }}>Welcome</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
              Enter your username
            </label>
            <input
              type="text"
              className="luxury-input"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={20}
            />
          </div>
          <button type="submit" className="btn-luxury">
            Continue <i className="bi bi-arrow-right"></i>
          </button>
        </form>
      </div>
    </>
  );
};