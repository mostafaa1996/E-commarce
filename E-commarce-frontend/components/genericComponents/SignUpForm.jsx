import Button from "./Button";
import InputField from "./InputField";
import { Link } from "react-router-dom";
import SocialAuthButton from "./SocialAuthButton";
export default function SignUpForm() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        <h2 className="text-[30px] font-extralight text-[#272727] text-center">
          Create Account
        </h2>

        {/* Social signup */}
        <div className="flex gap-4 justify-center">
          <SocialAuthButton label="Sign up with Google" />
          <SocialAuthButton label="Sign up with Facebook" />
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-sm text-zinc-400 tracking-widest">OR</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Inputs */}
        <InputField placeholder="Full Name" />
        <InputField placeholder="Email" type="email" />
        <InputField placeholder="Password" type="password" />

        <Button className="w-full">Create Account</Button>

        <p className="text-sm text-center text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FF6543] cursor-pointer">Login</Link>
        </p>
      </div>
    </div>
  );
}
