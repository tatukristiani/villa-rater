import React, { useState, useEffect, useCallback } from "react";
import { Villa } from "../../types/types";
import { ImageCarousel } from "../ImageCarousel";
import { DateRangeDisplay } from "../DateRangeDisplay";

interface VillaViewPageProps {
  villa: Villa & { avgRating?: number };
  userRating?: number;
  onBack: () => void;
  resetKey: string | number;
}

export const VillaViewPage: React.FC<VillaViewPageProps> = ({
  villa,
  userRating,
  onBack,
  resetKey,
}) => {
  const [enlargedImageIndex, setEnlargedImageIndex] = useState<number | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Navigate to next image - using useCallback to prevent stale closures
  const nextImage = useCallback(() => {
    setEnlargedImageIndex((prev) => {
      if (prev === null || villa.images.length === 0) return prev;
      return (prev + 1) % villa.images.length;
    });
  }, [villa.images.length]);

  // Navigate to previous image - using useCallback to prevent stale closures
  const prevImage = useCallback(() => {
    setEnlargedImageIndex((prev) => {
      if (prev === null || villa.images.length === 0) return prev;
      return prev === 0 ? villa.images.length - 1 : prev - 1;
    });
  }, [villa.images.length]);

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
  }, [enlargedImageIndex, nextImage, prevImage, closeEnlargedImage]);

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
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        <i className="bi bi-arrow-left"></i> Back to Results
      </button>

      <div className="glass-card">
        {/* Header with location badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "var(--primary-gold)", margin: 0 }}>
            {villa.title}
          </h2>
          {villa.avgRating && (
            <div className="rating-badge">
              <i className="bi bi-star-fill"></i> {villa.avgRating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Image carousel with click handler */}
        <ImageCarousel
          images={villa.images}
          alt={villa.title}
          height="300px"
          onImageClick={openEnlargedImage}
          resetKey={resetKey}
        />

        {/* Location Information */}
        <div
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: villa.address ? "10px" : 0,
            }}
          >
            <i
              className="bi bi-geo-alt-fill"
              style={{ color: "var(--primary-gold)" }}
            ></i>
            <span style={{ color: "var(--text-light)", fontWeight: 500 }}>
              {villa.city}, {villa.country}
            </span>
          </div>
          {villa.address && (
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
            >
              <i
                className="bi bi-map"
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                  marginTop: "2px",
                }}
              ></i>
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                {villa.address}
              </span>
            </div>
          )}
        </div>

        {/* Availability & Pricing Section */}
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              color: "var(--primary-gold)",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="bi bi-calendar-check"></i> Availability & Pricing
          </h4>
          <DateRangeDisplay
            dateRanges={villa.villa_date_ranges}
            compact={false}
          />
        </div>

        {/* Additional Information */}
        {villa.additional_information && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h4 style={{ color: "var(--primary-gold)"}}>
              <i className="bi bi-info-circle"></i> Amenities & Features
            </h4>
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
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {villa.additional_information
                .split(/[,.]/)
                .filter(Boolean)
                .map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: "inline-block",
                      background: "rgba(212, 175, 55, 0.1)",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      margin: "5px",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      fontSize: "14px",
                      color: "var(--text-light)",
                    }}
                  >
                    <i
                      className="bi bi-check-circle"
                      style={{
                        color: "var(--primary-gold)",
                        marginRight: "5px",
                      }}
                    ></i>
                    {feature.trim()}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* User's Rating */}
        {userRating && (
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <small style={{ color: "var(--text-muted)" }}>Your Rating</small>
            <div style={{ marginTop: "5px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color:
                      star <= userRating
                        ? "var(--primary-gold)"
                        : "rgba(212, 175, 55, 0.3)",
                    fontSize: "20px",
                    marginRight: "3px",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-luxury"
            onClick={() =>
              villa.address &&
              window.open(
                `https://www.google.com/maps/search/${encodeURIComponent(
                  villa.address
                )}`,
                "_blank"
              )
            }
            style={{ flex: 1 }}
            disabled={!villa.address}
          >
            <i className="bi bi-map"></i> View on Map
          </button>
          <button
            className="btn-luxury btn-luxury-secondary"
            onClick={onBack}
            style={{ flex: 1 }}
          >
            Back to Results
          </button>
        </div>
      </div>

      {/* Render the full-screen modal outside of the glass-card */}
      {renderFullScreenModal()}
    </>
  );
};
