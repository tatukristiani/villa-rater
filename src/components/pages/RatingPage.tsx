import React, { useState } from 'react';
import { Villa } from '../../types';
import { formatPrice } from '../../utils/helpers';
import { ImageCarousel } from '../ImageCarousel';

interface RatingPageProps {
  villa: Villa;
  currentIndex: number;
  totalVillas: number;
  onSaveRating: (rating: number) => void;
  onNext: () => void;
  hasRated: boolean;
}

export const RatingPage: React.FC<RatingPageProps> = ({
  villa,
  currentIndex,
  totalVillas,
  onSaveRating,
  onNext,
  hasRated
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSaveRating = () => {
    if (rating > 0) {
      onSaveRating(rating);
    }
  };

  const displayRating = hoveredStar || rating;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--primary-gold)' }}>
          Villa {currentIndex + 1} of {totalVillas}
        </h3>
        <span style={{ 
          background: 'rgba(212, 175, 55, 0.2)', 
          color: 'var(--primary-gold)',
          padding: '5px 10px',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          <i className="bi bi-geo-alt"></i> {villa.city}, {villa.country}
        </span>
      </div>
      
      {/* Replace the single image with the carousel */}
      <ImageCarousel 
        images={villa.images} 
        alt={villa.title}
        height="250px"
      />
      
      <h2 style={{ color: 'var(--text-light)', margin: '15px 0' }}>{villa.title}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <small style={{ color: 'var(--text-muted)' }}>Price per week</small>
          <h4 style={{ color: 'var(--primary-gold)' }}>€{formatPrice(villa.price)}</h4>
        </div>
        <div>
          <small style={{ color: 'var(--text-muted)' }}>Available</small>
          <p style={{ color: 'var(--text-light)' }}>{villa.start_date} to {villa.end_date}</p>
        </div>
      </div>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '15px', 
        borderRadius: '10px', 
        marginBottom: '20px' 
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          <i className="bi bi-map"></i> {villa.address}
        </p>
      </div>
      
      {villa.additional_information && (
        <div style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          <i className="bi bi-info-circle"></i> {villa.additional_information}
        </div>
      )}
      
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(value => (
          <span
            key={value}
            className={`star ${value <= displayRating ? 'active' : ''}`}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoveredStar(value)}
            onMouseLeave={() => setHoveredStar(0)}
          >
            ★
          </span>
        ))}
      </div>
      
      {!hasRated && (
        <button 
          className="btn-luxury" 
          onClick={handleSaveRating}
          disabled={rating === 0}
          style={{ marginBottom: '10px', opacity: rating === 0 ? 0.5 : 1 }}
        >
          <i className="bi bi-check-circle"></i> Save Rating
        </button>
      )}
      
      {hasRated && (
        <button className="btn-luxury btn-luxury-secondary" onClick={onNext}>
          Next Villa <i className="bi bi-arrow-right"></i>
        </button>
      )}
    </div>
  );
};