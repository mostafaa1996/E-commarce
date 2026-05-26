import Card from "@/components/genericComponents/Card";
import CardBadge from "@/components/genericComponents/CardBadge";
import CardTag from "@/components/genericComponents/CardTag";
import Icon from "@/system/icons/Icon";

export default function PaymentCard({
  type,
  isDefault = false,
  name,
  cardNumber,
  expires,
  setDefault,
  deleteCard,
}) {
  return (
    <Card className="relative p-4 active:scale-100">
      {isDefault && <CardBadge>Default</CardBadge>}

      <CardTag>{type}</CardTag>

      <div className="flex flex-col">
        <h4 className="break-words text-lg font-light tracking-widest sm:text-[21px]">
          {`**** **** **** ${cardNumber}`}
        </h4>
        <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:gap-10">
          <div>
            <span className="block text-xs">CARDHOLDER</span>
            {name}
          </div>

          <div>
            <span className="block text-xs">EXPIRES</span>
            {expires}
          </div>
        </div>
      </div>

      <div
        className={`mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-4 text-sm sm:flex-row sm:items-center ${
          isDefault ? "sm:justify-end" : "sm:justify-between"
        }`}
      >
        <button
          className={`flex items-center gap-2 text-zinc-600 hover:text-[#FF6543] active:scale-95 ${
            isDefault ? "hidden" : ""
          }`}
          onClick={setDefault}
        >
          <Icon name="edit" size={18} strokeWidth={1.5} variant="primary" />
          Set Default
        </button>

        <button
          className="flex items-center gap-2 text-red-500 hover:text-red-600 active:scale-95"
          onClick={deleteCard}
        >
          <Icon name="trash" size={18} strokeWidth={1.5} variant="primary" />
          Remove
        </button>
      </div>
    </Card>
  );
}
