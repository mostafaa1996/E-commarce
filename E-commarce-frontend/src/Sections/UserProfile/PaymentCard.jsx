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
}) {
  return (
    <>
      <Card className="cursor-pointer p-4 relative">
        {isDefault && <CardBadge>Default</CardBadge>}

        <CardTag>{type}</CardTag>

        <div className="flex flex-col">
          <h4 className="font-light text-[21px] tracking-widest">
            •••• •••• •••• 4242
          </h4>
          <div className="flex gap-10 mt-4 text-sm text-zinc-500">
            <div>
              <span className="block text-xs">CARDHOLDER</span>
              {name}
            </div>

            <div>
              <span className="block text-xs">EXPIRES</span>
              08/27
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 mt-6 pt-4 text-sm flex items-center justify-between">
          <button className="text-zinc-600 hover:text-[#FF6543] flex items-center gap-2">
            <Icon name="edit" size={18} strokeWidth={1.5} variant="primary" />
            Set Default
          </button>

          <button className="text-red-500 hover:text-red-600 flex items-center gap-2">
            <Icon name="trash" size={18} strokeWidth={1.5} variant="primary" />
            Remove
          </button>
        </div>
      </Card>
    </>
  );
}
