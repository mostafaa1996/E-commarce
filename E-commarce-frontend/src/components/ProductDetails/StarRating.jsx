import { Star } from "lucide-react";

const StarRating = ({ rating = 0, size = 16, showValue = false }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const fullCount = rating - full >= 0.75 ? full + 1 : full;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < fullCount;
          const half = !filled && i === full && hasHalf;
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              {/* shadow of the star */}
              <Star className="absolute inset-0 text-muted-foreground/30" fill="currentColor" style={{ width: size, height: size }} />
              {/* filled star or half filled star */}
              {(filled || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: half ? size / 2 : size }}>
                  <Star className="text-primary" fill="currentColor" style={{ width: size, height: size }} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && <span className="ml-1 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
