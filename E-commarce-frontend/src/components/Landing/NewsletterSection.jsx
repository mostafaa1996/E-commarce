import { Mail } from "lucide-react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import  InputField  from "@/components/genericComponents/InputField";

export default function NewsletterSection() {
  return (
    <section className="container mx-auto my-16 px-4">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-orange-500 to-orange-400 p-8 text-center text-primary-foreground md:p-14">
        <Mail className="mx-auto h-10 w-10 opacity-90" />
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
          Get the latest tech deals first
        </h2>
        <p className="mx-auto mt-3 max-w-xl opacity-95">
          Subscribe to receive exclusive offers, new arrivals, and product
          updates.
        </p>
        <form
          className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <InputField
            type="email"
            required
            placeholder="Enter your email address"
            className="h-12 border-transparent bg-white/95 text-foreground"
          />
          <AdminButton
            type="submit"
            size="lg"
            variant="secondary"
            className="h-12 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Subscribe
          </AdminButton>
        </form>
      </div>
    </section>
  );
}
