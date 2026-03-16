import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/system/stripePromise";

export default function StripeElementsWrapper({ open, getClientSecret, children }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    getClientSecret().then((data) => {
      if (mounted) {
        setClientSecret(data.clientSecret);
      }
    });

    return () => {
      mounted = false;
      setClientSecret("");
    };
  }, [open, getClientSecret]);

  if (!open || !clientSecret) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret }}
      key={clientSecret}
    >
      {children(clientSecret)}
    </Elements>
  );
}

