"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EsewaFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const targetParams = new URLSearchParams();

    targetParams.set("provider", "esewa");
    targetParams.set("status", "cancelled");

    const bookingId = searchParams.get("bookingId");
    const paymentRef = searchParams.get("paymentRef");
    const transactionUuid = searchParams.get("transaction_uuid");
    const data = searchParams.get("data");
    const refId = searchParams.get("ref_id");

    
    if (bookingId) targetParams.set("bookingId", bookingId);
    if (paymentRef) targetParams.set("paymentRef", paymentRef);
    if (transactionUuid) targetParams.set("transaction_uuid", transactionUuid);
    if (data) targetParams.set("data", data);
    if (refId) targetParams.set("ref_id", refId);

    router.replace(`/payment/result?${targetParams.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <p className="text-sm text-slate-600">Redirecting to payment result...</p>
    </div>
  );
}
