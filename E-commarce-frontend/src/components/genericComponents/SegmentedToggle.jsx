import Icon from "@/system/icons/Icon";
export default function SegmentedToggle({ value, onChange, options }) {
  return (
    <div className="flex bg-zinc-100 rounded-full p-1 w-fit h-fit">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-4 py-1.5 text-sm rounded-full transition flex items-center gap-2
            ${
              value === option
                ? "bg-white shadow text-[#272727]"
                : "text-zinc-500"
            }
          `}
        >
          {option.iconName && (
            <Icon
              name={option.iconName}
              size={16}
              strokeWidth={1.5}
              variant="primary"
            />
          )}
          {option.name}
        </button>
      ))}
    </div>
  );
}
