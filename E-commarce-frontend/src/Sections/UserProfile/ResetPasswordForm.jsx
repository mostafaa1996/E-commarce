import InputField from "../../../Components/genericComponents/InputField";
import Button from "../../../Components/genericComponents/Button";
import Icon from "../../system/icons/Icon";
export default function ResetPasswordForm({ title }) {
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <h3 className="text-[21px] font-light text-[#272727] mb-6 flex items-center gap-2">
        <Icon name="password" size={24} strokeWidth={1.5} variant="primary" />
        {title}
      </h3>
      <form className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="flex flex-col gap-4">
          <InputField
            label="Current Password"
            placeholder="********"
            type="password"
          />

          <InputField
            label="New Password"
            placeholder="********"
            type="password"
          />

          <InputField
            label="Confirm Password"
            placeholder="********"
            type="password"
          />
        </div>
        <Button
          type="submit"
          className="px-5 py-2 rounded-lg text-[16px] hover:bg-zinc-500  
          transition duration-300 ease-in-out cursor-pointer active:scale-95 w-fit self-end"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}
