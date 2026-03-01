import InputField from "@/components/genericComponents/InputField";
import { Form } from "react-router-dom";
import Icon from "@/system/icons/Icon";
export default function EditAddressForm({
  InitialFormData,
  title,
  buttonText,
  buttonIconName,
  onCancel,
}) {
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <h3 className="text-[21px] font-light text-[#272727] mb-6">{title}</h3>
      <Form className="flex flex-col gap-6" method="post">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Label (e.g. Home)"
            placeholder="Home"
            name="label"
            defaultValue={InitialFormData?.label}
          />

          <InputField
            label="Full Name"
            placeholder="John Doe"
            name="name"
            defaultValue={InitialFormData?.name}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Street Address"
            placeholder="123 Main Street, Apt 4B"
            name="street"
            defaultValue={InitialFormData?.street}
          />

          <InputField
            label="City, State"
            placeholder="New York, NY"
            name="city"
            defaultValue={
              InitialFormData &&
              `${InitialFormData?.city}, ${InitialFormData?.state}`
            }
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="ZIP Code"
            placeholder="10001"
            name="zip"
            defaultValue={InitialFormData?.zipCode}
          />

          <InputField
            label="Country"
            placeholder="United States"
            name="country"
            defaultValue={InitialFormData?.country}
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Email"
            placeholder="l7P8o@example.com"
            name="email"
            defaultValue={InitialFormData?.email}
          />

          <InputField
            label="Phone"
            placeholder="(123) 456-7890"
            name="phone"
            defaultValue={InitialFormData?.phone}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200">
          <button
            type="button"
            className="
              px-5 py-2
              rounded-lg
              border border-zinc-200
              text-xl
              hover:bg-zinc-100
              transition
              cursor-pointer
            "
            onClick={onCancel}
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
              text-xl
              hover:bg-[#e05535]
              transition
              cursor-pointer
              flex flex-row items-center gap-2
            "
          >
            <Icon
              name={buttonIconName}
              size={24}
              strokeWidth={1.5}
              variant="white"
            />
            {buttonText}
          </button>
          <input type="hidden" name="intent" value={buttonText} />
          <input type="hidden" name="id" value={InitialFormData?._id} />
        </div>
      </Form>
    </div>
  );
}
