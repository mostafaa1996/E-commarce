import Icon from "../../system/icons/Icon";
import InputField from "../../../components/genericComponents/InputField";

export default function FormSection({ title }) {
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-[21px] font-light text-[#272727] flex items-center gap-2">
          <Icon name="payment" size={24} strokeWidth={1.5} variant="primary" />
          {title}
        </h3>
        <span className="text-sm text-zinc-500">SSL Encrypted</span>
      </div>
      <form className="flex flex-col gap-6">
        {/* Cardholder */}
        <InputField label="Cardholder Name" placeholder="John Doe" />

        {/* Card Number */}
        <InputField label="Card Number" placeholder="1234 5678 9012 3456" />

        {/* Expiry + CVC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Expiry Date" placeholder="MM/YY" />

          <InputField label="CVC" placeholder="123" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200">
          <button
            type="button"
            className="px-5 py-2 rounded-lg border border-zinc-200 text-sm
              hover:bg-zinc-100 transition "
          >
            Cancel
          </button>

          <button
            type="submit"
            className=" px-6 py-2 rounded-lg bg-[#FF6543] text-white text-sm
              hover:bg-[#e05535] transition "
          >
            Add Card
          </button>
        </div>
      </form>
    </div>
  );
}
