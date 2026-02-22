import SelectField from "../../../components/genericComponents/SelectField";
import SegmentedToggle from "../../../components/genericComponents/SegmentedToggle";
import SwitchToggle from "../../../components/genericComponents/SwitchToggle";
import Icon from "../../system/icons/Icon";
export default function PreferencesSection() {
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <h3 className="text-[21px] font-light text-[#272727] mb-6 flex items-center gap-2">
        <Icon name="" size={24} strokeWidth={1.5} variant="primary" />
        preferences
      </h3>
      <form className="flex flex-col gap-6">
        <div className="flex lg:flex-row flex-col gap-4">
          <SelectField
            label="Language"
            defaultValue="English"
            options={["English", "Spanish", "Arabic", "French", "German"]}
          />

          <SelectField
            label="Currency"
            defaultValue="USD"
            options={["", "USD", "EUR", "EGYP", "GBP"]}
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
      </form>
    </div>
  );
}
