import React, { useState, useEffect, useCallback } from "react";
import { Villa } from "../../types/types";
import { ImageCarousel } from "../ImageCarousel";
import { DateRangeDisplay } from "../DateRangeDisplay";

interface RatingPageProps {
  villa: Villa;
  currentIndex: number;
  totalVillas: number;
  onSaveRating: (rating: number) => void;
  onNext: () => void;
  hasRated: boolean;
  resetKey: string | number;
}

export const RatingPage: React.FC<RatingPageProps> = ({
  villa,
  currentIndex,
  totalVillas,
  onSaveRating,
  onNext,
  hasRated,
  resetKey,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [enlargedImageIndex, setEnlargedImageIndex] = useState<number | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleSaveRating = () => {
    if (rating > 0) {
      onSaveRating(rating);
    }
  };

  const displayRating = hoveredStar || rating;

  // Open enlarged image
  const openEnlargedImage = (imageUrl: string) => {
    const index = villa.images.findIndex((img) => img === imageUrl);
    if (index !== -1) {
      setEnlargedImageIndex(index);
      // Lock body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
  };

  // Close enlarged image
  const closeEnlargedImage = useCallback(() => {
    setEnlargedImageIndex(null);
    // Restore body scroll
    document.body.style.overflow = "auto";
  }, []);

  // Navigate to next image
  const nextImage = () => {
    if (enlargedImageIndex !== null && villa.images.length > 0) {
      setEnlargedImageIndex((enlargedImageIndex + 1) % villa.images.length);
    }
  };

  // Navigate to previous image
  const prevImage = () => {
    if (enlargedImageIndex !== null && villa.images.length > 0) {
      setEnlargedImageIndex(
        enlargedImageIndex === 0
          ? villa.images.length - 1
          : enlargedImageIndex - 1
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (enlargedImageIndex === null) return;

      switch (e.key) {
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "Escape":
          closeEnlargedImage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedImageIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  // Create portal for full-screen modal
  const renderFullScreenModal = () => {
    if (enlargedImageIndex === null) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          zIndex: 99999,
          margin: 0,
          padding: 0,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with back button, title and close button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 15px",
            background: "rgba(20, 20, 20, 0.95)",
            borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3
              style={{
                color: "var(--primary-gold)",
                margin: 0,
                fontSize: "16px",
              }}
            >
              {villa.title}
            </h3>

            {villa.images.length > 1 && (
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  background: "rgba(212, 175, 55, 0.1)",
                  padding: "3px 10px",
                  borderRadius: "10px",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                }}
              >
                {enlargedImageIndex + 1} / {villa.images.length}
              </span>
            )}
          </div>
        </div>
        {/* Close button (X) */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "10px",
            zIndex: 9999,
          }}
        >
          <button
            style={{
              background: "rgba(212, 175, 55, 0.9)",
              color: "var(--primary-dark)",
              border: "none",
              borderRadius: "11%",
              width: "36px",
              height: "30px",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              flexShrink: 0,
            }}
            onClick={closeEnlargedImage}
          >
            x
          </button>
        </div>

        {/* Main image container */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            minHeight: 0, // Important for flex child
            marginBottom: "5px",
            marginTop: "11px",
          }}
        >
          <img
            src={villa.images[enlargedImageIndex]}
            alt={`${villa.title} - Image ${enlargedImageIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              cursor: "default",
            }}
          />

          {/* Navigation buttons - only show if more than 1 image */}
          {villa.images.length > 1 && (
            <>
              {/* Previous button */}
              <button
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(212, 175, 55, 0.8)",
                  color: "var(--primary-dark)",
                  border: "none",
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease",
                  zIndex: 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {/* Next button */}
              <button
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(212, 175, 55, 0.8)",
                  color: "var(--primary-dark)",
                  border: "none",
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease",
                  zIndex: 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip at bottom - always visible */}
        {villa.images.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              padding: "10px",
              background: "rgba(20, 20, 20, 0.95)",
              borderTop: "1px solid rgba(212, 175, 55, 0.2)",
              overflowX: "auto",
              flexShrink: 0,
              justifyContent: "center",
              WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
            }}
          >
            {villa.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  width: window.innerWidth > 768 ? "60px" : "45px",
                  height: window.innerWidth > 768 ? "60px" : "45px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  cursor: "pointer",
                  opacity: idx === enlargedImageIndex ? 1 : 0.4,
                  border:
                    idx === enlargedImageIndex
                      ? "2px solid var(--primary-gold)"
                      : "2px solid transparent",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedImageIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="glass-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "var(--primary-gold)" }}>
            Villa {currentIndex + 1} of {totalVillas}
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                color: "var(--primary-gold)",
                padding: "5px 10px",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            >
              <i className="bi bi-geo-alt"></i> {villa.city}, {villa.country}
            </span>
          </div>
        </div>

        {/* Image carousel */}
        <ImageCarousel
          images={villa.images}
          alt={villa.title}
          height="250px"
          onImageClick={openEnlargedImage}
          resetKey={resetKey}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <h2 style={{ color: "var(--text-light)", margin: "15px 0" }}>
            {villa.title}
          </h2>
          <a
            href={villa.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--primary-gold)",
              color: "#fff",
              padding: "5px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
            }}
          >
            <i className="bi bi-link-45deg"></i> View Website
          </a>
        </div>

        {/* Date ranges and prices display */}
        <div style={{ marginBottom: "20px" }}>
          <DateRangeDisplay
            dateRanges={villa.villa_date_ranges}
            compact={true}
          />
        </div>

        {/* Address and Map button */}
        {villa.address && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                margin: 0,
              }}
            >
              <i className="bi bi-map"></i> {villa.address}
            </p>
            <button
              className="btn-luxury"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/${encodeURIComponent(
                    villa.address ?? ""
                  )}`,
                  "_blank"
                )
              }
              style={{ flex: 1 }}
            >
              <i className="bi bi-map"></i> View on Map
            </button>
          </div>
        )}

        {villa.additional_information && (
          <ul
            style={{
              color: "var(--text-muted)",
              marginBottom: "20px",
              paddingLeft: "20px",
            }}
          >
            {villa.additional_information.split(",").map((info, idx) => (
              <li key={idx} style={{ marginBottom: "6px" }}>
                <i className="bi bi-info-circle"></i> {info.trim()}
              </li>
            ))}
          </ul>
        )}

        {/* --- Weather Information --- */}
        <div
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            borderRadius: "10px",
            padding: "10px 15px",
            marginBottom: "20px",
            color: "var(--text-muted)",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          <h4 style={{ color: "var(--primary-gold)", marginBottom: "8px" }}>
            <i className="bi bi-sun"></i> Weather (Approximate Min/Max)
          </h4>
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            <li>May: 15 - 23°C</li>
            <li>June: 19 - 35°C</li>
            <li>July-August: 22 - 35°C</li>
            <li>September: 19 - 30°C</li>
            <li>October: 15 - 30°C</li>
          </ul>
        </div>

        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              className={`star ${value <= displayRating ? "active" : ""}`}
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
            style={{ marginBottom: "10px", opacity: rating === 0 ? 0.5 : 1 }}
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

      {/* Render the full-screen modal outside of the glass-card */}
      {renderFullScreenModal()}
    </>
  );
};
