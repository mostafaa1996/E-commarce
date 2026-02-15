export default function Avatar({ src, alt }) {
  return (
    <div className="w-20 h-20 rounded-full overflow-hidden border">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
