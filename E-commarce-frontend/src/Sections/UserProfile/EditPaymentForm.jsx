import Icon from "@/system/icons/Icon";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { queryClient } from "@/queryClient";
import { useRef } from "react";

export default function FormSection({ title, clientSecret , onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({
    text: null,
    type: null,
  });
  const CancelButtonRef = useRef(null);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // Stripe.js has not yet loaded.
    // Make sure to disable form submission until Stripe.js has loaded.
    if (!stripe || !elements) return;
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setMsg({
          text: submitError.message || "Please check your payment details",
          type: "error",
        });
        return;
      }
      const result = await stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setMsg({
          text: result.error.message || "Something went wrong",
          type: "error",
        });
      } else if (result.setupIntent?.status === "succeeded") {
        setMsg({ text: "Card saved successfully", type: "success" });
        await queryClient.invalidateQueries(["profile-payments"]);
        CancelButtonRef.current.click();
      } else {
        setMsg({ text: "Card saved successfully", type: "success" });
      }
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
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-lg font-light text-[#272727] sm:text-[21px]">
          <Icon name="payment" size={24} strokeWidth={1.5} variant="primary" />
          {title}
        </h3>
        <span className="text-sm text-zinc-500">powered by Stripe</span>
      </div>

      <div className="flex flex-col gap-6">
        <PaymentElement />
        {/* Actions */}
        <div className="flex flex-col">
          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end sm:gap-4">
            <button
              type="button"
              className="rounded-lg border border-zinc-200 px-5 py-2 text-base
                hover:bg-zinc-100 transition "
              onClick={() => onCancel()}
              ref={CancelButtonRef}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#FF6543] px-6 py-2 text-base text-white
                hover:bg-[#e05535] transition "
              disabled={!stripe || !elements || loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
          {msg && (
            <div
              className={`text-md mt-3 text-left sm:text-end ${
                msg.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
