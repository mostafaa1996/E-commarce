import InputField from "../genericComponents/InputField";
import TextArea from "../genericComponents/TextArea";
import { billingFields } from "../../src/Data/billingFields";
export default function BillingDetailsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-16
          "
        >
          {/* Billing details */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
              BILLING DETAILS
            </h2>

            <div className="flex flex-col gap-4">
              {billingFields.map((field, index) => {
                return (
                  <>
                    <label className="text-[21px] font-light text-zinc-500">
                      {field.label}
                    </label>
                    <InputField
                      key={index}
                      placeholder={field.placeholder}
                      type={field.type}
                      defaultValue={field.value}
                    />
                  </>
                );
              })}
            </div>
          </div>

          {/* Additional information */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
              ADDITIONAL INFORMATION
            </h2>

            <TextArea placeholder="Notes about your order. Like special notes for delivery." />
          </div>
        </div>
      </div>
    </section>
  );
}
