import SelectField from "@/components/genericComponents/SelectField";
import SegmentedToggle from "@/components/genericComponents/SegmentedToggle";
import SwitchToggle from "@/components/genericComponents/SwitchToggle";
import Icon from "@/system/icons/Icon";
import { Form } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function PreferencesSection() {
  const { t, i18n } = useTranslation();
  function handleLanguageChange(lang) {
    console.log(lang);
    i18n.changeLanguage(lang);
  }
  function handleCurrencyChange(currency) {
    console.log(currency);
  }
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <h3 className="text-[21px] font-light text-[#272727] mb-6 flex items-center gap-2">
        <Icon name="" size={24} strokeWidth={1.5} variant="primary" />
        preferences
      </h3>
      <Form className="flex flex-col gap-6">
        <div className="flex lg:flex-row flex-col gap-4">
          <SelectField
            label="Language"
            defaultValue="English"
            options={[
              { text: "English", value: "en" },
              { text: "Spanish", value: "es" },
              { text: "Arabic", value: "ar" },
              { text: "French", value: "fr" },
              { text: "German", value: "de" },
            ]}
            onChange={handleLanguageChange}
          />

          <SelectField
            label="Currency"
            defaultValue="USD"
            options={["", "USD", "EUR", "EGYP", "GBP"]}
            onChange={handleCurrencyChange}
          />
        </div>

        <div className="flex lg:flex-row lg:justify-between flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-[21px] font-light text-[#272727] flex items-center gap-2">
              Apperance
            </h1>
            <p className="text-sm text-zinc-500">
              Customize the appearance of the app to match your preferences.
            </p>
          </div>
          <SegmentedToggle
            options={[
              { name: "Light", iconName: "sun" },
              { name: "Dark", iconName: "moon" },
            ]}
          />
        </div>

        <div className="flex lg:flex-row lg:justify-between flex-col gap-4 border-t border-zinc-200 pt-4">
          <div className="flex flex-col">
            <h1 className="text-[21px] font-light text-[#272727] flex items-center gap-2">
              Two-Factor Authentication
            </h1>
            <p className="text-sm text-zinc-500">
              Enable two-factor authentication to add an extra layer of security
              to your account.
            </p>
          </div>
          <SwitchToggle />
        </div>
      </Form>
    </div>
  );
}
