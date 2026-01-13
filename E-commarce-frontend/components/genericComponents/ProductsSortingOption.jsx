import DropDownMenuArrow from "/drop_down_menu.svg";
import DropDownMenu from "./DropDownMenu";
export default function ProductsSortingOption({
  sort = "Default sorting",
  ShowFilterMenu,
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 text-sm text-zinc-500 hover:text-[#FF6543]">
        <p>{sort}</p>
        <button onClick={ShowFilterMenu} className="cursor-pointer">
          <img src={DropDownMenuArrow} alt=" Drop Down Menu" />
        </button>
      </div>
      <DropDownMenu />
    </div>
  );
}
