import { useState, useRef, useEffect } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  value,
  onChange,
  disabled = false,
  size = "md",
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const starSize = sizes[size];

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseMove = (e: React.MouseEvent, starIndex: number) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;

    const rating = starIndex + (percent > 0.5 ? 1 : 0.5);
    setHoverValue(rating);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowLeft":
        onChange(Math.max(0, value - 0.5));
        break;
      case "ArrowRight":
        onChange(Math.min(5, value + 0.5));
        break;
      case "Home":
        onChange(0);
        break;
      case "End":
        onChange(5);
        break;
      default:
        const num = parseInt(e.key);
        if (num >= 0 && num <= 5) {
          onChange(num);
        }
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div
      ref={containerRef}
      className="flex gap-1 items-center"
      role="slider"
      aria-label="Rating"
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={value}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoverValue(0)}
    >
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const filled = displayValue > starIndex;
        const halfFilled = displayValue === starIndex + 0.5;

        return (
          <button
            key={starIndex}
            type="button"
            className={`relative ${starSize} focus:outline-none ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => handleClick(starIndex + 1)}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            disabled={disabled}
            aria-hidden="true"
          >
            <svg
              className="absolute inset-0"
              fill={filled ? "#fbbf24" : "none"}
              stroke="#fbbf24"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {halfFilled && (
              <svg
                className="absolute inset-0"
                fill="#fbbf24"
                viewBox="0 0 24 24"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </button>
        );
      })}
      <span className="ml-2 text-sm font-medium">{displayValue}</span>
    </div>
  );
}
