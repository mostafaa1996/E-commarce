import TextArea from "@/components/genericComponents/TextArea";
import InputField from "@/components/genericComponents/InputField";
import SelectField from "@/components/genericComponents/SelectField";
import { Form } from "react-router-dom";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { mongoDateToInputDate } from "@/utils/utils";
export default function ProfileForm({
  data,
  className,
  id,
  AfterUpdatingData,
}) {
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
        <div className="flex flex-col gap-1">
          <InputField
            label="First Name"
            placeholder="First name"
            name="firstName"
            defaultValue={data?.firstName}
          />
          {AfterUpdatingData?.errors &&
            Array.isArray(AfterUpdatingData?.errors) && (
              <span className="text-sm text-red-500">
                {
                  AfterUpdatingData.errors.find(
                    (err) => err.path === "firstName",
                  )?.msg
                }
              </span>
            )}
        </div>
        <div className="flex flex-col gap-1">
          <InputField
            label="Last Name"
            placeholder="Last name"
            name="lastName"
            defaultValue={data?.lastName}
          />
          {AfterUpdatingData?.errors &&
            Array.isArray(AfterUpdatingData?.errors) && (
              <span className="text-sm text-red-500">
                {
                  AfterUpdatingData.errors.find(
                    (err) => err.path === "lastName",
                  )?.msg
                }
              </span>
            )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="flex flex-col gap-1">
          <InputField
            label="Email Address"
            placeholder="...@email.com"
            name="email"
            defaultValue={data?.email}
          />
          {AfterUpdatingData?.errors &&
            Array.isArray(AfterUpdatingData?.errors) && (
              <span className="text-sm text-red-500">
                {
                  AfterUpdatingData.errors.find((err) => err.path === "email")
                    ?.msg
                }
              </span>
            )}
        </div>
        <div className="flex flex-col gap-1">
          <InputField
            label="Phone Number"
            placeholder="+1 234 567 890"
            name="phone"
            defaultValue={data?.phone}
          />
          {AfterUpdatingData?.errors &&
            Array.isArray(AfterUpdatingData?.errors) && (
              <span className="text-sm text-red-500">
                {
                  AfterUpdatingData.errors.find((err) => err.path === "phone")
                    ?.msg
                }
              </span>
            )}
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="flex flex-col gap-1">
          <InputField
            label="Date of Birth"
            type="date"
            placeholder="1990-05-15"
            name="dateOfBirth"
            defaultValue={mongoDateToInputDate(data?.DateOfBirth)}
          />
          {AfterUpdatingData?.errors &&
            Array.isArray(AfterUpdatingData?.errors) && (
              <span className="text-sm text-red-500">
                {
                  AfterUpdatingData.errors.find(
                    (err) => err.path === "dateOfBirth",
                  )?.msg
                }
              </span>
            )}
        </div>
        <div className="flex flex-col gap-1">
          <SelectField
            label="Gender"
            defaultValue={data?.gender || "Male"}
            options={["Male", "Female", "Other"]}
            name="gender"
          />
          {AfterUpdatingData?.errors &&
            Array.isArray(AfterUpdatingData?.errors) && (
              <span className="text-sm text-red-500">
                {
                  AfterUpdatingData.errors.find((err) => err.path === "gender")
                    ?.msg
                }
              </span>
            )}
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1">
        <InputField
          label="Location"
          placeholder="city, country"
          name="location"
          defaultValue={data?.location}
        />
        {AfterUpdatingData?.errors &&
          Array.isArray(AfterUpdatingData?.errors) && (
            <span className="text-sm text-red-500">
              {
                AfterUpdatingData.errors.find(
                  (err) => err.path === "location",
                )?.msg
              }
            </span>
          )}
      </div>

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
