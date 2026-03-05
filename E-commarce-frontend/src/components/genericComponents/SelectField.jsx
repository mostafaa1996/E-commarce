export default function SelectField({ label, options, ...props }) {
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
        {...props}
        className="border border-zinc-200 rounded-lg px-4 py-2 text-sm
          focus:outline-none focus:border-[#FF6543] transition duration-300 ease-in-out"
        onChange={e => props.onChange(e.target.value)}
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
