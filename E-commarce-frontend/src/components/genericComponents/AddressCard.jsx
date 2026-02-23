import Card from "./Card";
import CardBadge from "./CardBadge";
import CardTag from "./CardTag";
import Icon from "@/system/icons/Icon";
export default function AddressCard({
  type,
  name,
  street,
  city,
  country,
  isDefault = false,
  onEdit,
  onSetDefault,
  onRemove,
  NavigationLink,
}) {
  return (
    <>
      <Card
        NavigationLink={NavigationLink}
        className="cursor-pointer p-4 relative"
      >
        {isDefault && <CardBadge>Default</CardBadge>}

        <CardTag color="bg-white text-zinc-500">{type}</CardTag>

        <div className="flex flex-col">
          <h4 className="font-light text-[21px]">{name}</h4>
          <p className="text-sm text-zinc-500">{street}</p>
          <p className="text-sm text-zinc-500">{city}</p>
          <p className="text-sm text-zinc-500">{country}</p>
        </div>

        <div className="border-t border-zinc-200 mt-6 pt-4 text-sm flex items-center justify-between">
          <div className="flex justify-between gap-10">
            <button
              className="text-zinc-600 hover:text-[#FF6543] flex items-center gap-2"
              onClick={onEdit}
            >
              <Icon name="edit" size={20} strokeWidth={1.5} variant="primary" />
              Edit
            </button>
            <button
              className="text-zinc-600 hover:text-[#FF6543] flex items-center gap-2"
              onClick={onSetDefault}
            >
              <Icon
                name="check"
                size={20}
                strokeWidth={1.5}
                variant="primary"
              />
              Set Default
            </button>
          </div>
          <button
            className="text-zinc-600 hover:text-[#FF6543] flex items-center gap-2 "
            onClick={onRemove}
          >
            <Icon name="trash" size={20} strokeWidth={1.5} variant="primary" />
            Remove
          </button>
        </div>
      </Card>
    </>
  );
}
