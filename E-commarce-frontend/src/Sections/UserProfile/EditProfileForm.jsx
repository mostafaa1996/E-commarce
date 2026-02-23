import TextArea from "@/components/genericComponents/TextArea";
import InputField from "@/components/genericComponents/InputField";
import SelectField from "@/components/genericComponents/SelectField";
export default function ProfileForm() {
  return (
    <form className="flex flex-col gap-6 border border-zinc-200 rounded-xl bg-white p-6">
      <h3 className="text-[21px] font-light text-[#272727] mb-6">
        Personal Form
      </h3>

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField label="First Name" placeholder="First name" />
        <InputField label="Last Name" placeholder="Last name" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField label="Email Address" placeholder="...@email.com" />
        <InputField label="Phone Number" placeholder="+1 234 567 890" />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          label="Date of Birth"
          type="date"
          placeholder="1990-05-15"
        />

        <SelectField
          label="Gender"
          defaultValue="Male"
          options={["Male", "Female", "Other"]}
        />
      </div>

      {/* Location */}
      <InputField label="Location" placeholder="city, country" />

      {/* Bio */}
      <TextArea
        label="Bio"
        rows={4}
        placeholder="write something about yourself..."
      />
    </form>
  );
}
