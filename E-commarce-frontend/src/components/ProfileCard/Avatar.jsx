import Icon from "@/system/icons/Icon";
export default function Avatar({ src, alt , onClick }) {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="w-20 h-20 rounded-full overflow-hidden border">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      <div className={`bg-[#FF6543] w-8 h-8 rounded-full cursor-pointer
       flex items-center justify-center absolute bottom-0 right-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100`}
       >
        <Icon
          name="camera"
          size={20}
          variant="surrounded"
        />
      </div>
    </div>
  );
}
