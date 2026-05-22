export default function SelectField({ label, options, onChange , ...props }) {
  const Options = options.map(option => {
    if(typeof option === "string") return {value: option , text: option};
    return {
      value: option.value,
      text: option.text,
    };
  });
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-zinc-500">
        {label}
      </label>

      <select
        className="rounded-lg border border-zinc-200 px-4 py-3 text-[16px] font-light
          focus:outline-none focus:border-[#FF6543] transition duration-300 ease-in-out"
        onChange={e => onChange?.(e.target.value)}
        {...props}
      >
        {Options.map(option => (
          <option key={`option-${option.value}-${option.text}`} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
