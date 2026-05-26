import TextArea from "@/components/genericComponents/TextArea";
import InputField from "@/components/genericComponents/InputField";
import SelectField from "@/components/genericComponents/SelectField";
import { Form } from "react-router-dom";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { mongoDateToInputDate } from "@/utils/utils";
export default function ProfileForm({ data, className, id }) {
  return (
    <Form
      id={id}
      method="post"
      className={twMerge(
        clsx(
          `flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:gap-6 sm:p-6`,
          className,
        ),
      )}
      encType="multipart/form-data"
    >
      <h3 className="mb-2 text-lg font-light text-[#272727] sm:mb-6 sm:text-[21px]">
        Personal Form
      </h3>

      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <InputField
          label="First Name"
          placeholder="First name"
          name="firstName"
          defaultValue={data?.firstName}
        />
        <InputField
          label="Last Name"
          placeholder="Last name"
          name="lastName"
          defaultValue={data?.lastName}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <InputField
          label="Email Address"
          placeholder="...@email.com"
          name="email"
          defaultValue={data?.email}
        />
        <InputField
          label="Phone Number"
          placeholder="+1 234 567 890"
          name="phone"
          defaultValue={data?.phone}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <InputField
          label="Date of Birth"
          type="date"
          placeholder="1990-05-15"
          name="dateOfBirth"
          defaultValue={mongoDateToInputDate(data?.DateOfBirth)}
        />

        <SelectField
          label="Gender"
          defaultValue={data?.gender || "Male"}
          options={["Male", "Female", "Other"]}
          name="gender"
        />
      </div>

      {/* Location */}
      <InputField
        label="Location"
        placeholder="city, country"
        name="location"
        defaultValue={data?.location}
      />

      {/* Bio */}
      <TextArea
        label="Bio"
        rows={4}
        placeholder="write something about yourself..."
        name="bio"
        defaultValue={data?.Bio}
      />
    </Form>
  );
}
