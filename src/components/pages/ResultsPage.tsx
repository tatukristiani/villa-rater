import React, { useState } from "react";
import { Villa } from "../../types";
import { formatPrice, getInitials } from "../../utils/helpers";

interface VillaWithRating extends Villa {
  avgRating: number;
  userRatings?: { userId: string; username: string; rating: number }[];
}

interface ResultsPageProps {
  villas: VillaWithRating[];
  onHome: () => void;
  onViewVilla: (villa: VillaWithRating) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  villas,
  onHome,
  onViewVilla,
}) => {
  const [expandedVilla, setExpandedVilla] = useState<string | null>(null);

  const toggleExpanded = (villaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedVilla(expandedVilla === villaId ? null : villaId);
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "var(--primary-gold)" }}>Results</h1>
        <p style={{ color: "var(--text-muted)" }}>Top rated villas</p>
      </div>

      <div>
        {villas.map((villa, index) => (
          <div key={villa.id}>
            <div
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
                      style={{
                        color: "var(--text-light)",
                        marginBottom: "5px",
                      }}
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
                  <span
                    style={{ color: "var(--primary-gold)", fontWeight: 600 }}
                  >
                    €{formatPrice(villa.price)}/week
                  </span>
                  {villa.userRatings && villa.userRatings.length > 0 && (
                    <button
                      onClick={(e) => toggleExpanded(villa.id, e)}
                      style={{
                        background: "rgba(212, 175, 55, 0.1)",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        borderRadius: "8px",
                        padding: "5px 12px",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(212, 175, 55, 0.2)";
                        e.currentTarget.style.color = "var(--primary-gold)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(212, 175, 55, 0.1)";
                        e.currentTarget.style.color = "var(--text-muted)";
                      }}
                    >
                      <i
                        className={`bi bi-chevron-${
                          expandedVilla === villa.id ? "up" : "down"
                        }`}
                      ></i>{" "}
                      Ratings
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded ratings section */}
            {expandedVilla === villa.id && villa.userRatings && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  padding: "15px",
                  marginTop: "-1px",
                  marginBottom: "20px",
                  borderRadius: "0 0 15px 15px",
                  border: "1px solid rgba(212, 175, 55, 0.1)",
                  borderTop: "none",
                  animation: "slideDown 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {villa.userRatings.map((userRating) => (
                    <div
                      key={userRating.userId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          {getInitials(userRating.username)}
                        </div>
                        <span
                          style={{
                            color: "var(--text-light)",
                            fontSize: "14px",
                          }}
                        >
                          {userRating.username}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color:
                                star <= userRating.rating
                                  ? "var(--primary-gold)"
                                  : "rgba(212, 175, 55, 0.2)",
                              fontSize: "14px",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ textAlign: "center" }}>
        <button className="btn-luxury" onClick={onHome}>
          <i className="bi bi-house"></i> Back to Home
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
