import React from "react";
import { Villa } from "../../types";
import { formatPrice } from "../../utils/helpers";

interface VillaWithRating extends Villa {
  avgRating: number;
}

interface ResultsPageProps {
  villas: VillaWithRating[];
  onHome: () => void;
  onViewVilla: (villa: VillaWithRating) => void; // NEW PROP
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  villas,
  onHome,
  onViewVilla,
}) => {
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "var(--primary-gold)" }}>Results</h1>
        <p style={{ color: "var(--text-muted)" }}>Top rated villas</p>
      </div>

      <div>
        {villas.map((villa, index) => (
          <div
            key={villa.id}
            className="villa-card"
            onClick={() => onViewVilla(villa)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ padding: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <h5
                    style={{ color: "var(--text-light)", marginBottom: "5px" }}
                  >
                    {index === 0 && (
                      <i
                        className="bi bi-trophy-fill"
                        style={{
                          color: "var(--primary-gold)",
                          marginRight: "5px",
                        }}
                      />
                    )}
                    {villa.title}
                  </h5>
                  <small style={{ color: "var(--text-muted)" }}>
                    <i className="bi bi-geo-alt"></i> {villa.city},{" "}
                    {villa.country}
                  </small>
                </div>
                <div className="rating-badge">
                  <i className="bi bi-star-fill"></i>{" "}
                  {villa.avgRating.toFixed(1)}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--primary-gold)", fontWeight: 600 }}>
                  €{formatPrice(villa.price)}/week
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ textAlign: "center" }}>
        <button className="btn-luxury" onClick={onHome}>
          <i className="bi bi-house"></i> Back to Home
        </button>
      </div>
    </>
  );
};
