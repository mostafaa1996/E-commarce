import InputField from "@/components/genericComponents/InputField";
import Button from "@/components/genericComponents/Button";
import Icon from "@/system/icons/Icon";
import { Form } from "react-router-dom";
import { useNavigation, useActionData } from "react-router-dom";
import { useEffect } from "react";
export default function ResetPasswordForm({ title }) {
  const navigation = useNavigation();
  const actionData = useActionData();
  useEffect(() => {
    setInterval(() => {
      if (actionData?.ok) {
        window.location.reload();
      }
    }, 3000);
  } , [actionData]);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-light text-[#272727] sm:mb-6 sm:text-[21px]">
        <Icon name="password" size={24} strokeWidth={1.5} variant="primary" />
        {title}
      </h3>
      <Form
        className="flex flex-col gap-4 sm:gap-6"
        method="post"
        action="/profile/settings"
      >
        {/* Row 1 */}
        <div className="flex flex-col gap-4">
          <InputField
            label="Current Password"
            placeholder="********"
            type="password"
            name="currentPassword"
          />

          <InputField
            label="New Password"
            placeholder="********"
            type="password"
            name="newPassword"
          />

          <InputField
            label="Confirm Password"
            placeholder="********"
            type="password"
            name="confirmPassword"
          />
          {actionData?.message === "Passwords do not match" && (
          <p className="text-red-600 text-end">the confirm Password do not match ...</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full rounded-lg px-5 py-2 text-[16px] transition duration-300 ease-in-out hover:bg-zinc-500 active:scale-95 sm:w-fit sm:self-end"
        >
          {navigation.state === "submitting"
            ? "Updating..."
            : "Update Password"}
        </Button>
        {actionData?.ok && (
          <p className="text-green-600 text-end">changed password successfully...</p>
        )}
      </Form>
    </div>
  );
}
