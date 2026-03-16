import InputField from "@/components/genericComponents/InputField";
import React from "react";
export default function BillingDetailsSection({ shippingDetails , onChange } ) {
  const billingFields = [
    {
      label: "First name*",
      placeholder: "First name",
      type: "text",
      value: shippingDetails?.firstName || "",
      name: "firstName",
    },
    {
      label: "Last name*",
      placeholder: "Last name",
      type: "text",
      value: shippingDetails?.lastName || "",
      name: "lastName",
    },
    {
      label: "Company name (optional)",
      placeholder: "Company name",
      type: "text",
      value: shippingDetails?.companyName || "",
      name: "companyName",
    },
    {
      label: "Country / Region* ",
      placeholder: "Country / Region *",
      type: "text",
      value: shippingDetails?.country || "",
      name: "country",
    },
    {
      label: "House number and street name* ",
      placeholder: "House number and street name",
      type: "text",
      value: shippingDetails?.street || "",
      name: "street",
    },
    {
      label: "Apartment, suite, etc. (optional)",
      placeholder: "Apartment, suite, etc.",
      type: "text",
      value: shippingDetails?.Apartment || "",
      name: "Apartment",
    },
    {
      label: "Town / City *",
      placeholder: "Town / City",
      type: "text",
      value: shippingDetails?.city || "",
      name: "city",
    },
    {
      label: "State *",
      placeholder: "State ",
      type: "text",
      value: shippingDetails?.state || "",
      name: "state",
    },
    {
      label: "ZIP Code *",
      placeholder: "ZIP Code ",
      type: "text",
      value: shippingDetails?.postalCode || "",
      name: "postalCode",
    },
    {
      label: "Phone *",
      placeholder: "Phone ",
      type: "text",
      value: shippingDetails?.phone || "",
      name: "phone",
    },
    {
      label: "Email address *",
      placeholder: "Email address ",
      type: "email",
      value: shippingDetails?.email || "",
      name: "email",
    },
  ];

  return (
    <section className=" bg-white">
      <div className="min-w-2xl px-6 ">
        <div className="flex flex-col gap-6">
          {/* Billing details */}
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
                    onChange={(e)=>onChange(e)}
                    name={field.name}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
