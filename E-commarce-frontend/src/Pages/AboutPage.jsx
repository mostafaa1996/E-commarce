import {
  Award,
  ChevronDown,
  Headphones,
  HelpCircle,
  Lock,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { createElement, useState } from "react";


const features = [
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Free delivery on orders over $50, with express options available.",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    desc: "256-bit SSL encryption keeps your payment details safe.",
  },
  {
    icon: Award,
    title: "Quality Products",
    desc: "Every item is hand-picked and quality-tested before shipping.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    desc: "Our friendly team is available 7 days a week to help.",
  },
];

const privacyPoints = [
  {
    title: "Information We Collect",
    body: "We collect information you provide when creating an account, placing an order, or contacting support. This includes your name, email, shipping address, and payment details. We also collect usage data such as pages visited and items viewed.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information helps us process orders, deliver products, personalize recommendations, send order updates, and improve your shopping experience. We never sell your personal data to third parties.",
  },
  {
    title: "Cookies",
    body: "We use cookies to remember your preferences, keep you signed in, and analyze site traffic. You can disable cookies in your browser, though some site features may not work properly.",
  },
  {
    title: "Data Security",
    body: "We use industry-standard SSL encryption, secure payment processors, and regular security audits to protect your information. Payment details are never stored on our servers.",
  },
  {
    title: "Third-Party Services",
    body: "We work with trusted partners for payment processing, shipping, and analytics. These partners only access the data needed to perform their services and are contractually required to protect it.",
  },
  {
    title: "Contact Us",
    body: "Questions about your privacy? Email us at privacy@shoply.com and our team will respond within 48 hours.",
  },
];

const terms = [
  {
    title: "Use of Website",
    body: "By accessing Shoply, you agree to use the site for lawful purposes only. You may not attempt to disrupt the service, misuse user data, or violate any applicable laws.",
  },
  {
    title: "Products and Pricing",
    body: "All product descriptions, images, and prices are provided in good faith. We reserve the right to correct any errors and update prices at any time without prior notice.",
  },
  {
    title: "Orders and Payments",
    body: "Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel orders at our discretion. Payment must be received in full before products are shipped.",
  },
  {
    title: "Shipping and Delivery",
    body: "We aim to dispatch all orders within 1-2 business days. Delivery times are estimates and may vary due to carrier delays. Risk of loss passes to you upon delivery.",
  },
  {
    title: "Returns and Refunds",
    body: "Items may be returned within 30 days of delivery in their original condition. Refunds are issued to the original payment method within 5-7 business days of receiving the return.",
  },
  {
    title: "Limitation of Liability",
    body: "Shoply is not liable for indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability is limited to the amount paid for the product in question.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms. Major changes will be communicated via email.",
  },
];

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3-5 business days. Express delivery arrives in 1-2 business days.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to over 50 countries. International delivery takes 7-14 business days.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships, you'll receive a tracking number via email to monitor delivery in real time.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Shop Pay.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be modified or cancelled within 1 hour of placing. After that, contact our support team.",
  },
  {
    q: "Is my personal information secure?",
    a: "Absolutely. We use industry-standard SSL encryption and never store your payment details.",
  },
];

const quickLinks = [
  { href: "#privacy", label: "Privacy" },
  { href: "#terms", label: "Terms" },
  { href: "#shipping", label: "Shipping" },
  { href: "#returns", label: "Returns" },
  { href: "#faqs", label: "FAQs" },
  { href: "#warranty", label: "Warranty" },
];

const stats = [
  { value: "1K+", label: "Happy customers" },
  { value: "1+", label: "Countries served" },
  { value: "2025", label: "Founded" },
];

function SectionShell({ id, children, className }) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 px-4 py-10 sm:px-6 lg:py-14", className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function SectionCard({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, eyebrow, title, description }) {
  return (
    <div className="mb-6 flex max-w-3xl items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {createElement(icon, { size: 21 })}
      </span>
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <span className="mt-3 block h-0.5 w-12 bg-primary" />
        {description && (
          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-muted"
      >
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-primary transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border bg-card px-4 py-4 text-sm leading-6 text-muted-foreground">
          {a}
        </div>
      )}
    </div>
  );
}

function NumberedInfoGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <article
          key={item.title}
          className="rounded-xl border border-border bg-background p-5"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AboutPage() {
  return (
    <main className="bg-background">
      <SectionShell id="about" className="pt-12 lg:pt-16">
        <SectionCard className="overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <SectionTitle
                icon={Award}
                eyebrow="About Shoply"
                title="Shopping made simple, transparent, and joyful."
                description="Since 2018, Shoply has helped over a million customers discover products they love. We believe great shopping should feel effortless from browse to unboxing."
              />
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <p className="text-2xl font-semibold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </SectionShell>

      <SectionShell id="story">
        <SectionCard>
          <SectionTitle
            icon={ShieldCheck}
            eyebrow="Our Story"
            title="Built around trust, quality, and useful service."
            description="Shoply started in a small garage with one big idea: build an online store that actually puts customers first."
          />
          <p className="max-w-4xl text-base leading-7 text-muted-foreground">
            Today, we work with hundreds of trusted brands and ship orders to
            over 50 countries, but our promise has not changed. Quality
            products, honest pricing, and people-first service guide every
            decision we make.
          </p>
        </SectionCard>
      </SectionShell>

      <SectionShell id="why-shoply">
        <SectionTitle
          icon={Award}
          eyebrow="Why Shop With Us"
          title="Everything customers expect from a reliable store."
          description="We keep the shopping experience practical, secure, and supported from product discovery to delivery."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {createElement(feature.icon, { size: 22 })}
              </div>
              <h3 className="font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="privacy">
        <SectionCard>
          <SectionTitle
            icon={Lock}
            eyebrow="Privacy"
            title="How we protect and use your information."
            description="Clear privacy practices help you understand what we collect, why we collect it, and how we keep it protected."
          />
          <NumberedInfoGrid items={privacyPoints} />
        </SectionCard>
      </SectionShell>

      <SectionShell id="terms">
        <SectionCard>
          <SectionTitle
            icon={ShieldCheck}
            eyebrow="Terms"
            title="The policies that guide your shopping experience."
            description="These terms explain how orders, payments, delivery, returns, and website use work at Shoply."
          />
          <NumberedInfoGrid items={terms} />
        </SectionCard>
      </SectionShell>

      <SectionShell id="shipping">
        <SectionCard>
          <SectionTitle
            icon={Truck}
            eyebrow="Shipping"
            title="Delivery options that match your schedule."
            description="Choose standard, express, or international shipping with clear tracking once your order leaves our warehouse."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Standard Shipping", "3-5 business days - Free on orders over $50"],
              ["Express Shipping", "1-2 business days - $9.99 flat rate"],
              [
                "International",
                "7-14 business days - Rates calculated at checkout",
              ],
              ["Order Tracking", "Tracking link emailed once your order ships."],
            ].map(([title, body]) => (
              <article
                key={title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>
      </SectionShell>

      <SectionShell id="returns">
        <SectionCard>
          <SectionTitle
            icon={RotateCcw}
            eyebrow="Returns"
            title="A simple return path if something is not right."
            description="Not in love with your purchase? We offer hassle-free returns within 30 days."
          />
          <ol className="grid gap-3 sm:grid-cols-2">
            {[
              "Start a return from your account dashboard within 30 days of delivery.",
              "Print your prepaid return label and pack the item in its original condition.",
              "Drop the package at any authorized carrier location.",
              "Refunds are issued to your original payment method within 5-7 business days.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex gap-3 rounded-xl border border-border bg-background p-4 text-sm leading-6"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </SectionShell>

      <SectionShell id="faqs">
        <SectionCard>
          <SectionTitle
            icon={HelpCircle}
            eyebrow="FAQs"
            title="Answers to common shopping questions."
            description="Find quick answers about shipping, tracking, payments, order changes, and account security."
          />
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </SectionCard>
      </SectionShell>

      <SectionShell id="warranty" className="pb-16">
        <SectionCard>
          <SectionTitle
            icon={ShieldCheck}
            eyebrow="Warranty"
            title="Product protection after your order arrives."
            description="Every product is backed by our quality guarantee, and most items include manufacturer coverage for defects in materials and workmanship."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "1-year limited warranty on electronics",
              "2-year warranty on appliances",
              "Lifetime warranty on select premium products",
              "Free repair or replacement for defective items",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm leading-6"
              >
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </SectionShell>
    </main>
  );
}
