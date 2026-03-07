export default function TabsHeader({ active, onChange , ReviewsCount }) {
  const tabs = [
    { id: "description", label: "DESCRIPTION" },
    { id: "reviews", label: "REVIEWS" },
  ];

  return (
    <div className="border-b border-[#E6E6E6] flex justify-center gap-10 text-sm tracking-widest">
      {tabs.map(tab => (
        <button
          key={`product-details-tabs-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={`pb-4 font-light transition duration-300 ease-in-out cursor-pointer
            ${active === tab.id
              ? "text-[#FF6543] border-b-2 border-[#FF6543]"
              : "text-[#272727] hover:text-[#FF6543]"
            }`}
        >
          {tab.label==="REVIEWS"?`REVIEWS (${ReviewsCount})`:tab.label}
        </button>
      ))}
    </div>
  );
}
