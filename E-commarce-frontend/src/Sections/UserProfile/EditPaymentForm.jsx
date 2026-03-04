import Icon from "@/system/icons/Icon";
import { Form } from "react-router-dom";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function FormSection({ title, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // Stripe.js has not yet loaded.
    // Make sure to disable form submission until Stripe.js has loaded.
    if (!stripe || !elements) return;

    try {
      const result = await stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (result.error) setMsg(result.error.message || "Something went wrong");
      else setMsg("Card saved successfully");
    } finally {
      setLoading(false);
    }
  }
  if (!clientSecret)
    return (
      <h1 className="text-center text-2xl font-bold">
        Loading payment form...
      </h1>
    );
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-6">
      <div className="flex flex-row items-center justify-between mb-5">
        <h3 className="text-[21px] font-light text-[#272727] flex items-center gap-2">
          <Icon name="payment" size={24} strokeWidth={1.5} variant="primary" />
          {title}
        </h3>
        <span className="text-sm text-zinc-500">powered by Stripe</span>
      </div>

      <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <PaymentElement />
        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200">
          <button
            type="button"
            className="px-5 py-2 rounded-lg border border-zinc-200 text-xl
              hover:bg-zinc-100 transition "
          >
            Cancel
          </button>

          <button
            type="submit"
            className=" px-6 py-2 rounded-lg bg-[#FF6543] text-white text-xl
              hover:bg-[#e05535] transition "
            disabled={!stripe || !elements || loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          {msg && <div className="text-red-500 text-md">{msg}</div>}
        </div>
      </Form>
    </div>
  );
}
