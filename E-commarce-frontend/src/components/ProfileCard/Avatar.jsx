import Icon from "@/system/icons/Icon";
export default function Avatar({ src, alt , onClick }) {
  return (
    <div className="relative group">
      <div className="w-20 h-20 rounded-full overflow-hidden border">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      <div className={`bg-[#FF6543] w-8 h-8 rounded-full cursor-pointer
       items-center justify-center absolute bottom-0 right-0 hidden group-hover:flex`}
       onClick = {onClick}
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
