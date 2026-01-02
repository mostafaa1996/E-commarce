import AuthAside from "../genericComponents/AuthAside";
import SignInForm from "../genericComponents/SignInForm";
export default function AuthSection() {
  return (
    <section className="min-h-screen flex bg-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-5">
        {/* Left side */}
        <div className="hidden lg:block lg:col-span-1">
          <AuthAside />
        </div>

        {/* Right side */}
        <div className="lg:col-span-4 flex items-center">
          <SignInForm />
        </div>
      </div>
    </section>
  );
}
