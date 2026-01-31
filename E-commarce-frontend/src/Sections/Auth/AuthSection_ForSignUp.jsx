import AuthAside from "../../../components/genericComponents/AuthAside";
import SignUpForm from "../../../components/genericComponents/SignUpForm";
export default function SignUpSection() {
  return (
    <section className="min-h-screen flex bg-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-5">
        {/* Left branding panel (same as login) */}
        <div className="hidden lg:block lg:col-span-1">
          <AuthAside />
        </div>

        {/* Right form */}
        <div className="lg:col-span-4 flex items-center">
          <SignUpForm />
        </div>
      </div>
    </section>
  );
}
