export default function SocialAuthButton({ label }) {
  return (
    <button
      className="
        px-6
        py-2
        border
        border-[#FF6543]
        text-[#FF6543]
        rounded-full
        text-sm
        font-light
        hover:bg-[#FF6543]
        hover:text-white
        transition
      "
    >
      {label}
    </button>
  );
}
