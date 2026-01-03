import SideBarFilter from "../genericComponents/SideBarFilter";
import SearchBar from "../genericComponents/SearchBox";
import Brands from "./Brands";

const Data = {
    categories: ["Laptops", "Phones", "Tablets"],
    tags: ["Laptops", "Phones", "Tablets"],
    SocialLinks: ["Facebook", "Instagram", "Twitter"],
}

export default function SideBarFilterSection(data = {}) {
  return (
    <aside className="ml-10 w-full lg:w-[310px] flex flex-col gap-10">
      <SearchBar />
      {
        Object.entries(Data).map(([category, items]) => (
          <SideBarFilter key={category} title={category} items={items} />
        ))
      }
     
    </aside>
  );
}
