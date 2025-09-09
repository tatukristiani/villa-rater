import React, { useState } from "react";
import { VillaDateRange } from "../types/types";
import { formatPrice } from "../utils/helpers";

interface DateRangeDisplayProps {
  dateRanges?: VillaDateRange[];
  compact?: boolean;
}

export const DateRangeDisplay: React.FC<DateRangeDisplayProps> = ({
  dateRanges = [],
  compact = false,
}) => {
  const [expanded, setExpanded] = useState(!compact);

  if (!dateRanges || dateRanges.length === 0) {
    return (
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "14px",
          fontStyle: "italic",
        }}
      >
        No availability dates
      </div>
    );
  }

  // Sort date ranges by start date
  const sortedRanges = [...dateRanges].sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  // Get price range for the entire villa
  const allPrices = dateRanges.flatMap((dr) =>
    dr.price_max ? [dr.price_min, dr.price_max] : [dr.price_min]
  );
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const formatPriceRange = (min: number, max: number | null) => {
    if (max && max !== min) {
      return `€${formatPrice(min)} - €${formatPrice(max)}`;
    }
    return `€${formatPrice(min)}`;
  };

  if (compact && !expanded) {
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => setExpanded(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212, 175, 55, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <small style={{ color: "var(--text-muted)" }}>
                {dateRanges.length} period{dateRanges.length > 1 ? "s" : ""}{" "}
                available
              </small>
              <div
                style={{
                  color: "var(--primary-gold)",
                  fontWeight: 600,
                  marginTop: "2px",
                }}
              >
                {minPrice === maxPrice
                  ? `€${formatPrice(minPrice)}/week`
                  : `€${formatPrice(minPrice)} - €${formatPrice(
                      maxPrice
                    )}/week`}
              </div>
            </div>
            <i
              className="bi bi-chevron-down"
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
              }}
            ></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(212, 175, 55, 0.1)",
      }}
    >
      {compact && (
        <div
          style={{
            padding: "10px 15px",
            background: "rgba(212, 175, 55, 0.1)",
            borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setExpanded(false)}
        >
          <span
            style={{
              color: "var(--primary-gold)",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <i className="bi bi-calendar3"></i> Available Periods
          </span>
          <i
            className="bi bi-chevron-up"
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
            }}
          ></i>
        </div>
      )}

      <div
        style={{
          maxHeight: compact ? "200px" : "none",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {sortedRanges.map((range, index) => (
          <div
            key={range.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              marginBottom: index < sortedRanges.length - 1 ? "8px" : 0,
              background: "rgba(212, 175, 55, 0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(212, 175, 55, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
              e.currentTarget.style.transform = "translateX(3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(212, 175, 55, 0.05)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i
                className="bi bi-calendar-week"
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              ></i>
              <div>
                <div
                  style={{
                    color: "var(--text-light)",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {formatDate(range.start_date)} - {formatDate(range.end_date)}
                </div>
                <small
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                  }}
                >
                  {Math.ceil(
                    (new Date(range.end_date).getTime() -
                      new Date(range.start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </small>
              </div>
            </div>
            <div
              style={{
                color: "var(--primary-gold)",
                fontWeight: 600,
                fontSize: "15px",
                textAlign: "right",
              }}
            >
              {formatPriceRange(range.price_min, range.price_max)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
