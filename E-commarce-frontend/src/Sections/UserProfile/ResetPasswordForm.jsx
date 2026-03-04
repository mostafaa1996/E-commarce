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
      if (actionData.ok) {
        window.location.reload();
      }
    }, 3000);
  } , [actionData]);
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <h3 className="text-[21px] font-light text-[#272727] mb-6 flex items-center gap-2">
        <Icon name="password" size={24} strokeWidth={1.5} variant="primary" />
        {title}
      </h3>
      <Form
        className="flex flex-col gap-6"
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
          className="px-5 py-2 rounded-lg text-[16px] hover:bg-zinc-500  
          transition duration-300 ease-in-out cursor-pointer active:scale-95 w-fit self-end"
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
