import InputField from "@/components/genericComponents/InputField";
import { Form } from "react-router-dom";
export default function EditAddressForm({ title }) {
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <h3 className="text-[21px] font-light text-[#272727] mb-6">{title}</h3>
      <Form className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Label (e.g. Home)" placeholder="Home" />

          <InputField label="Full Name" placeholder="John Doe" />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Street Address"
            placeholder="123 Main Street, Apt 4B"
          />

          <InputField label="City, State" placeholder="New York, NY" />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="ZIP Code" placeholder="10001" />

          <InputField label="Country" placeholder="United States" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200">
          <button
            type="button"
            className="
              px-5 py-2
              rounded-lg
              border border-zinc-200
              text-sm
              hover:bg-zinc-100
              transition
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              px-6 py-2
              rounded-lg
              bg-[#FF6543]
              text-white
              text-sm
              hover:bg-[#e05535]
              transition
            "
          >
            Update Address
          </button>
        </div>
      </Form>
    </div>
  );
}
