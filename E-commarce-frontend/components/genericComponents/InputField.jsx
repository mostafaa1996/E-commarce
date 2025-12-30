export default function InputField({ placeholder, type = "text" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`
        w-full
        px-4
        py-3
        border
        border-zinc-200
        rounded-lg
        text-[16px]
        font-light
        placeholder:text-zinc-400
        focus:outline-none
        focus:border-[#FF6543]
      `}
    />
  );
}
