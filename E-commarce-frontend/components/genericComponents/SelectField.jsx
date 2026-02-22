export default function SelectField({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-zinc-500">
        {label}
      </label>

      <select
        {...props}
        className="border border-zinc-200 rounded-lg px-4 py-2 text-sm
          focus:outline-none focus:border-[#FF6543] transition duration-300 ease-in-out"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
