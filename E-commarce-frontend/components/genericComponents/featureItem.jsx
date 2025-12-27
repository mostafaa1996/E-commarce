export default  function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 max-w-xs">
      {/* Icon */}
      <div className="flex items-start w-15 h-15 rounded-full text-[#FF6543]">
        <img src={icon} alt="icon" />   
      </div>

      {/* Text */}
      <div>
        <h3 className="sm:text-lg text-sm  font-extralight tracking-wide text-[#272727] uppercase">
          {title}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 font-extralight">
          {description}
        </p>
      </div>
    </div>
  );
}