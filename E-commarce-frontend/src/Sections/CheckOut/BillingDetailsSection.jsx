import InputField from "../../../components/genericComponents/InputField";
import TextArea from "../../../components/genericComponents/TextArea";
import React from "react";
import { useCheckoutStore } from "../../zustand_checkout/checkoutStore";
export default function BillingDetailsSection() {
  const ShippingDetails = useCheckoutStore((state) => state.ShippingDetails)[0];
  const billingFields = [
    {label:"First name*" , placeholder: "First name" , type: "text" , value:ShippingDetails.firstName },
    {label:"Last name*" , placeholder: "Last name"  , type: "text" , value:ShippingDetails.lastName },
    {label:"Company name (optional)" , placeholder: "Company name" , type: "text" , value:ShippingDetails.companyName },
    {label:"Country / Region* " , placeholder: "Country / Region *" , type: "text", value:ShippingDetails.country },
    {label:"House number and street name* " , placeholder: "House number and street name" , type: "text" , value:ShippingDetails.street },
    {label:"Apartment, suite, etc. (optional)" , placeholder: "Apartment, suite, etc." , type: "text" , value:ShippingDetails.Apartment },
    {label:"Town / City *" , placeholder: "Town / City" , type: "text" , value:ShippingDetails.city },
    {label:"State *" , placeholder: "State " , type: "text" , value:ShippingDetails.state },
    {label:"ZIP Code *" , placeholder: "ZIP Code " , type: "text" , value:ShippingDetails.postalCode },
    {label:"Phone *" , placeholder: "Phone " , type: "text" , value:ShippingDetails.phone },
    {label:"Email address *" , placeholder: "Email address ", type: "email" , value:ShippingDetails.email },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-16
          `}
        >
          {/* Billing details */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
              BILLING DETAILS
            </h2>

            <div className="flex flex-col gap-4">
              {billingFields.map((field, index) => {
                return (
                  <React.Fragment key={" checkout Page " + field.type + index}>
                    <label className="text-[21px] font-light text-zinc-500">
                      {field.label}
                    </label>
                    <InputField
                      placeholder={field.placeholder}
                      type={field.type}
                      defaultValue={field.value}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Additional information */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
              ADDITIONAL INFORMATION
            </h2>

            <TextArea placeholder="Notes about your order. Like special notes for delivery." value={ShippingDetails.notes} />
          </div>
        </div>
      </div>
    </section>
  );
}
