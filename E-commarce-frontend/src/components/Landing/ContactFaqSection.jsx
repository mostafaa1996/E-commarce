import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How can I track my order?",
    a: "Once your order ships, you'll receive a tracking link by email. You can also track it in your account dashboard under Orders.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and cash on delivery in selected cities.",
  },
  {
    q: "Can I return a product?",
    a: "Yes, all items can be returned within 30 days of delivery in their original condition for a full refund.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 2-5 business days. Express options are available at checkout for next-day delivery in major cities.",
  },
  {
    q: "Are the products original?",
    a: "Absolutely. Every product on ShopLite is 100% genuine and comes with the original manufacturer warranty.",
  },
];

function FaqItem({ question, answer, open, onClick }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-accent/40"
      >
        <span className="text-sm font-medium md:text-base">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ContactFaqSection({ openFaq, setOpenFaq }) {
  return (
    <section className="container mx-auto max-w-3xl px-4 pb-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-muted-foreground">
          Quick answers to common questions.
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FaqItem
            key={faq.q}
            question={faq.q}
            answer={faq.a}
            open={openFaq === index}
            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
}
