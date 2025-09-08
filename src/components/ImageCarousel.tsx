// src/components/ImageCarousel.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  height?: string;
  borderRadius?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  alt = 'Villa image',
  height = '250px',
  borderRadius = '15px'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      handleNext();
    }
    if (isRightSwipe && images.length > 1) {
      handlePrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning]);

  if (!images || images.length === 0) {
    return (
      <div style={{
        width: '100%',
        height,
        borderRadius,
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        No images available
      </div>
    );
  }

  const carouselStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height,
    borderRadius,
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.2)',
    marginBottom: '20px'
  };

  const imageContainerStyles: React.CSSProperties = {
    display: 'flex',
    transition: 'transform 0.3s ease-in-out',
    transform: `translateX(-${currentIndex * 100}%)`,
    height: '100%'
  };

  const imageStyles: React.CSSProperties = {
    minWidth: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const arrowButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(26, 26, 46, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: 'var(--primary-gold)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'all 0.3s ease',
    zIndex: 2
  };

  const indicatorContainerStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '15px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 2
  };

  const indicatorStyles = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? '24px' : '8px',
    height: '8px',
    borderRadius: '4px',
    background: isActive ? 'var(--primary-gold)' : 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : 'none'
  });

  const imageCounterStyles: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(26, 26, 46, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '5px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    color: 'var(--primary-gold)',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 2
  };

  return (
    <div 
      ref={carouselRef}
      style={carouselStyles}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Images */}
      <div style={imageContainerStyles}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} ${index + 1}`}
            style={imageStyles}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {/* Only show controls if there are multiple images */}
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrevious}
            style={{
              ...arrowButtonStyles,
              left: '15px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 26, 46, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            aria-label="Previous image"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            style={{
              ...arrowButtonStyles,
              right: '15px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 26, 46, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            aria-label="Next image"
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          {/* Image Counter */}
          <div style={imageCounterStyles}>
            {currentIndex + 1} / {images.length}
          </div>

          {/* Indicators */}
          <div style={indicatorContainerStyles}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={indicatorStyles(index === currentIndex)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};