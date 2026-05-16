import { Label } from "./Label";
import { CheckBox } from "./CheckBox";
export default function SidebarFilter({
  title,
  items,
  onSelectFilter,
  activeFilter,
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h3>
        <div className="mt-1 h-px w-full bg-gradient-to-r from-border to-transparent" />
      </div>

      <ul
        className={`mt-4 space-y-3 text-[21px] text-[#272727] 
          font-extralight hover:overflow-y-auto max-h-[250px] overflow-hidden `}
      >
        {items &&
          items.map((item) => (
            <li
              key={item}
              className={` 
              hover:text-[#FF6543] active:scale-110 transition duration-300 ease-in
              ${
                activeFilter[title.toLowerCase()]?.includes(item)
                  ? "text-[#FF6543] underline"
                  : ""
              }`}
            >
              <Label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <CheckBox
                  checked={
                    Array.isArray(activeFilter[title.toLowerCase()])
                      ? activeFilter[title.toLowerCase()].includes(item) 
                      : activeFilter[title.toLowerCase()] === item 
                  }
                  onCheckedChange={() => {
                    onSelectFilter(title.toLowerCase(), item);
                  }}
                />
                <span>{item}</span>
              </Label>
            </li>
          ))}
      </ul>
    </div>
  );
}
