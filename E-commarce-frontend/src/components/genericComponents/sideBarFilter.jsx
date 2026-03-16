export default function SidebarFilter({
  title,
  items,
  onSelectFilter,
  activeFilter,
}) {
  return (
    <div>
      <h3 className="text-[30px] font-extralight uppercase tracking-wide">
        {title}
      </h3>

      <div
        className="mt-2 mb-6 h-[10px] w-[60%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #D4D4D4 0 1px, transparent 1px 10px)",
        }}
      />

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
              ${activeFilter[title.toLowerCase()]?.includes(item)? "text-[#FF6543] underline" : ""}`}
            >
              <button
                onClick={() => {
                  onSelectFilter(title.toLowerCase(), item);
                }}
              >
                {item}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
