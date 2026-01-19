export default function ProductGallery({ images, active, onChange }) {
  return (
    <div className="flex gap-6">
      {/* Thumbnails */}
      <div className="flex flex-col gap-4">
        {images.map((img, index) => (
          <button
            key={img}
            onClick={() => onChange(index)}
            className={`
              w-16 h-16 rounded-lg border
              flex items-center justify-center
              ${active === index ? "border-[#FF6543]" : "border-zinc-200"}
            `}
          >
            <img src={img} className="w-12 object-contain" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 aspect-square border rounded-xl flex items-center justify-center bg-white">
        <img
          src={images[active]}
          className="w-3/4 object-contain"
        />
      </div>
    </div>
  );
}
