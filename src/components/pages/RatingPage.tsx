import React, { useState } from "react";
import { Villa } from "../../types/types";
import { ImageCarousel } from "../ImageCarousel";
import { DateRangeDisplay } from "../DateRangeDisplay";

// TODO: Generate with claude at 22:00
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
  hasRated,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const handleSaveRating = () => {
    if (rating > 0) {
      onSaveRating(rating);
    }
  };

  const displayRating = hoveredStar || rating;

  return (
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

      {/* Replace the single image with the carousel */}
      <ImageCarousel
        images={villa.images}
        alt={villa.title}
        height="250px"
        onImageClick={(img: string) => setEnlargedImage(img)}
      />

      {/* Enlarged image modal */}
      {enlargedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setEnlargedImage(null)}
        >
          <img
            src={enlargedImage}
            alt="Enlarged villa"
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              border: "4px solid var(--primary-gold)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            style={{
              position: "absolute",
              top: "40px",
              right: "60px",
              background: "var(--primary-gold)",
              color: "var(--primary-dark)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "22px",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
            onClick={() => setEnlargedImage(null)}
          >
            &times;
          </button>
        </div>
      )}

      <h2 style={{ color: "var(--text-light)", margin: "15px 0" }}>
        {villa.title}
      </h2>

      {/* Date ranges and prices display */}
      <div style={{ marginBottom: "20px" }}>
        <DateRangeDisplay dateRanges={villa.villa_date_ranges} compact={true} />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          marginBottom: "20px",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
          <i className="bi bi-map"></i> {villa.address}
        </p>
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
      </div>

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
  );
};
