"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EsewaSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const targetParams = new URLSearchParams();

    targetParams.set("provider", "esewa");
    targetParams.set("status", "success");

    const bookingId = searchParams.get("bookingId");
    const rawPaymentRef = searchParams.get("paymentRef") || "";
    const transactionUuid = searchParams.get("transaction_uuid");
    let data = searchParams.get("data");
    const refId = searchParams.get("ref_id");

    let paymentRef = rawPaymentRef;
    const embeddedDataMatch = rawPaymentRef.match(/^(.*?)[?&]data=(.+)$/i);
    if (embeddedDataMatch) {
      paymentRef = embeddedDataMatch[1];
      if (!data) {
        data = embeddedDataMatch[2];
      }
    }

    if (bookingId) targetParams.set("bookingId", bookingId);
    if (paymentRef) targetParams.set("paymentRef", paymentRef);
    if (transactionUuid) targetParams.set("transaction_uuid", transactionUuid);
    if (data) targetParams.set("data", data);
    if (refId) targetParams.set("ref_id", refId);

    router.replace(`/payment-success?${targetParams.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <p className="text-sm text-slate-600">Redirecting to payment result...</p>
    </div>
  );
}
