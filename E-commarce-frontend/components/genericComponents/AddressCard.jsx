import ProcessStatus from "./ProcessStatus";
function AddressCard({ type, street, city, isDefault = false, onEdit }) {
  return (
    <div className={`flex flex-row items-start justify-between gap-4 border rounded-xl p-6 
        ${isDefault ? "border-[#FF6543]" : "border-zinc-200"}`}>
      <div>
        {/* Type */}
        <span className="text-xs tracking-widest text-zinc-500 uppercase">
          {type}
        </span>

        {/* Content */}
        <div className="text-sm text-[#272727] font-light">
          <div>{name}</div>
          <div className="text-zinc-500">{street}</div>
          <div className="text-zinc-500">{city}</div>
        </div>

        {/* Actions */}
        <button
          onClick={onEdit}
          className="text-sm text-[#FF6543] mt-2 text-left hover:underline"
        >
          Edit
        </button>
      </div>
      {/* Default badge */}
      {isDefault && <ProcessStatus status="default" />}
    </div>
  );
}

export default AddressCard;
