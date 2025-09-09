import React from "react";
import { Villa } from "../../types/types";
import { ImageCarousel } from "../ImageCarousel";
import { DateRangeDisplay } from "../DateRangeDisplay";

interface VillaViewPageProps {
  villa: Villa & { avgRating?: number };
  userRating?: number;
  onBack: () => void;
}

export const VillaViewPage: React.FC<VillaViewPageProps> = ({
  villa,
  userRating,
  onBack,
}) => {
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

        {/* Image carousel */}
        <ImageCarousel images={villa.images} alt={villa.title} height="300px" />

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
            <h4 style={{ color: "var(--primary-gold)", marginBottom: "15px" }}>
              <i className="bi bi-info-circle"></i> Amenities & Features
            </h4>
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
    </>
  );
};
