"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MockPaymentCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const bookingId = searchParams.get("bookingId") || "";
  const ref = searchParams.get("ref") || "";
  const method = (searchParams.get("method") || "esewa").toLowerCase() === "khalti" ? "khalti" : "esewa";
  const amount = Number(searchParams.get("amount") || 0);

  const amountLabel = useMemo(() => {
    if (!Number.isFinite(amount)) return "0.00";
    return amount.toFixed(2);
  }, [amount]);

  const handleComplete = () => {
    if (!bookingId || !ref) {
      router.push("/payment/result?status=failed");
      return;
    }

    setProcessing(true);
    const mockTxnId = `MOCK-${Date.now()}`;
    router.push(`/payment/result?bookingId=${encodeURIComponent(bookingId)}&ref=${encodeURIComponent(ref)}&method=${method}&status=success&txnId=${encodeURIComponent(mockTxnId)}`);
  };

  const handleCancel = () => {
    if (!bookingId || !ref) {
      router.push("/payment/result?status=failed");
      return;
    }

    router.push(`/payment/result?bookingId=${encodeURIComponent(bookingId)}&ref=${encodeURIComponent(ref)}&method=${method}&status=failed`);
  };

  const themeClass = method === "esewa"
    ? "border-green-200 bg-green-50"
    : "border-purple-200 bg-purple-50";

  const buttonClass = method === "esewa"
    ? "bg-green-600 hover:bg-green-700"
    : "bg-purple-600 hover:bg-purple-700";

  return (
    <div className="min-h-[70vh] px-4 py-10 flex items-center justify-center">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-sm ${themeClass}`}>
        <h1 className="text-2xl font-bold text-slate-900">{method === "esewa" ? "eSewa Checkout" : "Khalti Checkout"}</h1>
        <p className="mt-2 text-sm text-slate-600">Demo payment interface for booking.</p>

        <div className="mt-5 rounded-xl bg-white p-4 border border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Booking ID</span>
            <span className="font-semibold">{bookingId || "-"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
            <span>Reference</span>
            <span className="font-semibold">{ref || "-"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
            <span>Amount</span>
            <span className="font-semibold">NPR {amountLabel}</span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <input type="text" placeholder="Full Name" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none" />
          <input type="text" placeholder="Mobile Number" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none" />
          <input type="text" placeholder={method === "esewa" ? "eSewa ID" : "Khalti ID"} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none" />
          <input type="password" placeholder="MPIN" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none" />
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={processing}
          className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-70 ${buttonClass}`}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
