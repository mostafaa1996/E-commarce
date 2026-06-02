import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const ImageGallery = ({ images = [], alt = "" }) => {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ show: false, x: 50, y: 50 });
  const mainRef = useRef(null);

  const handleMove = (e) => {
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ show: true, x, y });
  };

  const next = () => setActive((p) => (p + 1) % images.length);
  const prev = () => setActive((p) => (p - 1 + images.length) % images.length);

  if (!images.length) return null;
  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide md:flex-col">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-secondary/50 transition-smooth ${
              active === i ? "border-primary shadow-glow" : "border-transparent hover:border-border"
            }`}
          >
            <img src={img.url} alt={img.alt || alt} className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1">
        <div
          ref={mainRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setZoom({ show: false, x: 50, y: 50 })}
          className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/30 shadow-card cursor-zoom-in"
        >
          <img
            src={current.url}
            alt={current.alt || alt}
            className="h-full w-full object-contain p-8 transition-transform duration-300 group-hover:scale-110"
            style={zoom.show ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(1.8)" } : undefined}
          />

          {/* Nav arrows */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-elevated backdrop-blur transition-smooth hover:bg-background group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-elevated backdrop-blur transition-smooth hover:bg-background group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            aria-label="Fullscreen"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-card backdrop-blur transition-smooth hover:bg-background group-hover:opacity-100"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur">
            {active + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
