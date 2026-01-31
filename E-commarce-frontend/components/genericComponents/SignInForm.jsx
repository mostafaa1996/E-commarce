import Button from "./Button";
import InputField from "./InputField";
import { Link, Form, useActionData } from "react-router-dom";
export default function SignInForm() {
  const error = useActionData();
  return (
    <Form className="justify-self-center w-full px-6" method="post">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-md flex flex-col gap-6">
          <h2 className="text-[30px] font-extralight text-[#272727] text-center">
            Sign-in
          </h2>

          <InputField placeholder="Email" type="email" name="email" required />
          <InputField
            placeholder="Password"
            type="password"
            name="password"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button className="w-full" type="submit">
            Login
          </Button>

          <p className="text-sm text-center text-zinc-500">
            Don’t have an account?{" "}
            <Link to="/Signup" className="text-[#FF6543] cursor-pointer">
              Signup Here
            </Link>
          </p>
        </div>
      </div>
    </Form>
  );
}
