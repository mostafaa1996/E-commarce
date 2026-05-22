import Icon from "@/system/icons/Icon";
import { Fragment } from "react";
export default function SegmentedToggle({ value, onChange, options }) {
  return (
    <div className="flex h-fit w-full rounded-full bg-zinc-100 p-1 sm:w-fit">
      {options.map((option) => (
        <Fragment key={`option-${option.name}`}>
          <button
            onClick={() => onChange(option)}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-1.5 text-sm transition sm:flex-none
              ${
                value === option.name
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
        </Fragment>
      ))}
    </div>
  );
}
