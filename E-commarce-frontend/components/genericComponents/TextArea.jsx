export default function TextArea({ placeholder }) {
  return (
    <textarea
      rows={4}
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
        resize-none
        focus:outline-none
        focus:border-[#FF6543]
      `}
    />
  );
}
