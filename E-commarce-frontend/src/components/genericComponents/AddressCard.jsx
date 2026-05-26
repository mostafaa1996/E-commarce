import Card from "./Card";
import CardBadge from "./CardBadge";
import CardTag from "./CardTag";
import Icon from "@/system/icons/Icon";
import {shortenText} from "@/utils/utils";
export default function AddressCard({
  type,
  name,
  street,
  city,
  country,
  state,
  email,
  phone,
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
        className="relative cursor-pointer p-4"
      >
        {isDefault && <CardBadge>Default</CardBadge>}

        <CardTag color="bg-zinc-200 text-zinc-600">{type}</CardTag>

        <div className="flex flex-col">
          <h4 className="text-lg font-light sm:text-[21px]">{shortenText(name,20)}</h4>
          <p className="text-sm text-zinc-500">{shortenText(street,20)}</p>
          <p className="text-sm text-zinc-500">{shortenText(`${city},${state}`, 20)}</p>
          <p className="text-sm text-zinc-500">{shortenText(country,10)}</p>
          <p className="text-sm text-zinc-500 line-clamp-1">{shortenText(email,10)}</p>
          <p className="text-sm text-zinc-500 line-clamp-1">{shortenText(phone,10)}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap justify-between gap-4 sm:gap-10">
            <button
              className="text-zinc-600 hover:text-[#FF6543] flex items-center gap-2"
              onClick={onEdit}
            >
              <Icon name="edit" size={20} strokeWidth={1.5} variant="primary" />
              Edit
            </button>
            <button
              className={`text-zinc-600 hover:text-[#FF6543] flex items-center gap-2 ${
                isDefault && "hidden"
              }`}
              type="button"
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
            className="flex items-center gap-2 text-zinc-600 hover:text-[#FF6543]"
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
