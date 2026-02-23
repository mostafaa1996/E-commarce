import PlayButton from "/playBtn.svg";
export default function VideoBlock({ image, onPlay }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100">
      <img src={image} alt="Media" className="w-full h-full object-cover" />

      {/* Play button */}
      <button
        onClick={onPlay}
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
        "
      >
        <img
          className="
            w-16
            h-16
            rounded-full
            border
            border-zinc-400
            flex
            items-center
            justify-center
            bg-white/70
            hover:scale-105
            transition
          "
          src={PlayButton}
          alt="Play Button"
        >
          
        </img>
      </button>
    </div>
  );
}
