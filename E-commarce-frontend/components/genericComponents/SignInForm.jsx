import Button from "./Button";
import InputField from "./InputField";
import { Link } from "react-router-dom";
export default function SignInForm() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        <h2 className="text-[30px] font-extralight text-[#272727] text-center">
          Sign-in
        </h2>

        <InputField placeholder="Email" type="email" />
        <InputField placeholder="Password" type="password" />

        <Button className="w-full">Login</Button>

        <p className="text-sm text-center text-zinc-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#FF6543] cursor-pointer">
            Signup Here
          </Link>
        </p>
      </div>
    </div>
  );
}
