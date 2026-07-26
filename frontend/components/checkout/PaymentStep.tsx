"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { AlertCircle, Loader2 } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { createPaymentIntent } from "@/lib/payments";

export default function PaymentStep({
  orderId,
  amount,
  onSuccess,
}: {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    createPaymentIntent(orderId)
      .then((res) => {
        if (!cancelled) setClientSecret(res.clientSecret);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not start payment.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (error) {
    return (
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#d97a3a]" />
        <p className="text-sm text-[#5f5e5e]">Preparing secure payment…</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <PaymentForm amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}

function PaymentForm({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError("");

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)]"
    >
      <PaymentElement />

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d97a3a] py-3.5 font-[family-name:var(--font-inter)] text-[16px] font-bold text-white transition-colors hover:bg-[#cc6d2f] disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Processing…" : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}