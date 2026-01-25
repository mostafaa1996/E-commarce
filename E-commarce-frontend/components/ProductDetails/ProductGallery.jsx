export default function ProductGallery({ images, active, onChange }) {
  return (
    <div className="flex gap-6">
      {/* Thumbnails */}
      <div className="flex flex-col gap-4">
        {images.map((img, index) => (
          <button
            key={`Product-Gallery-Thumbnail-${index}`}
            onClick={() => onChange(index)}
            className={`
              w-16 h-16 rounded-lg border
              flex items-center justify-center
              ${active === index ? "border-[#FF6543]" : "border-zinc-200"}
            `}
          >
            <img src={img.url} className="w-12 object-contain" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 aspect-square border border-zinc-200 rounded-xl flex items-center justify-center bg-white">
        <img
          src={images[active].url}
          className="w-full object-contain"
        />
      </div>
    </div>
  );
}
