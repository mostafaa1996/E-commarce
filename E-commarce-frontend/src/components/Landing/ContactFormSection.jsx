import { CheckCircle2, MapPin, Send } from "lucide-react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import  InputField  from "@/components/genericComponents/InputField";
import  Textarea  from "@/components/genericComponents/Textarea";
import ContactField from "./ContactField";

export default function ContactFormSection({
  storeInfo,
  submitted,
  errors,
  form,
  setField,
  onSubmit,
}) {
  return (
    <section className="container mx-auto grid gap-8 px-4 py-16 lg:grid-cols-5">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-10 lg:col-span-3">
        <h2 className="text-2xl font-bold md:text-3xl">Send us a message</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We typically reply within 24 hours.
        </p>

        {submitted && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Message sent successfully!</p>
              <p className="mt-0.5 text-xs">
                Thanks for reaching out - we'll get back to you shortly.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <ContactField label="Full Name" required error={errors.name}>
            <InputField
              value={form.name}
              onChange={setField("name")}
              maxLength={100}
              placeholder="Jane Doe"
            />
          </ContactField>

          <ContactField label="Email" required error={errors.email}>
            <InputField
              type="email"
              value={form.email}
              onChange={setField("email")}
              maxLength={255}
              placeholder="you@example.com"
            />
          </ContactField>

          <ContactField label="Phone" hint="Optional">
            <InputField
              value={form.phone}
              onChange={setField("phone")}
              maxLength={20}
              placeholder="+20 ..."
            />
          </ContactField>

          <ContactField label="Order Number" hint="Optional">
            <InputField
              value={form.order}
              onChange={setField("order")}
              maxLength={32}
              placeholder="#SHL-12345"
            />
          </ContactField>

          <div className="sm:col-span-2">
            <ContactField label="Subject" required error={errors.subject}>
              <InputField
                value={form.subject}
                onChange={setField("subject")}
                maxLength={120}
                placeholder="How can we help?"
              />
            </ContactField>
          </div>

          <div className="sm:col-span-2">
            <ContactField
              label="Message"
              required
              error={errors.message}
              hint={`${form.message.length}/1000`}
            >
              <Textarea
                value={form.message}
                onChange={setField("message")}
                rows={6}
                maxLength={1000}
                placeholder="Tell us a bit more..."
              />
            </ContactField>
          </div>

          <div className="sm:col-span-2">
            <AdminButton type="submit" size="lg" className="rounded-full px-8">
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </AdminButton>
          </div>
        </form>
      </div>

      <div className="space-y-4 lg:col-span-2">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-orange-100 via-background to-amber-50">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.9 0.02 60) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0.02 60) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-400 text-primary-foreground shadow-xl">
                <MapPin className="h-7 w-7" />
              </div>
              <p className="mt-4 font-bold">{storeInfo.address}</p>
              <p className="text-sm text-muted-foreground">{storeInfo.city}, {storeInfo.country}</p>
            </div>
          </div>
          <div className="border-t border-border p-5">
            <p className="text-sm font-semibold">Visit our office</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open {storeInfo.workingDays} - {storeInfo.workingHours}. Closed on {storeInfo.holidays}.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-primary to-orange-500 p-6 text-primary-foreground">
          <p className="text-sm font-semibold opacity-90">Need urgent help?</p>
          <p className="mt-1 text-2xl font-bold">{storeInfo.phone}</p>
          <p className="mt-2 text-xs opacity-90">
            Call our support line during working hours.
          </p>
        </div>
      </div>
    </section>
  );
}
