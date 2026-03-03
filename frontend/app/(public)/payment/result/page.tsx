"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyBookingPayment } from "@/lib/api/booking";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const [message, setMessage] = useState("Processing payment result...");

  const bookingId = searchParams.get("bookingId") || "";
  const provider = (searchParams.get("provider") || "").toLowerCase();
  const paymentRef = searchParams.get("paymentRef") || undefined;
  const rawStatus = (searchParams.get("status") || "").toLowerCase();
  const pidx = searchParams.get("pidx") || undefined;
  const gatewayTxnId =
    searchParams.get("transaction_id") ||
    searchParams.get("pidx") ||
    searchParams.get("ref_id") ||
    searchParams.get("txnId") ||
    undefined;

  const decodeEsewaData = (encodedData: string) => {
    try {
      const decoded = atob(encodedData);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  const esewaData = searchParams.get("data") ? decodeEsewaData(searchParams.get("data") as string) : null;
  const transactionUuid =
    searchParams.get("transaction_uuid") ||
    esewaData?.transaction_uuid ||
    paymentRef ||
    undefined;

  const normalizedStatus = useMemo(() => {
    if (["success", "paid", "complete", "completed"].includes(rawStatus)) {
      return "success";
    }
    if (["failed", "failure", "cancel", "cancelled"].includes(rawStatus)) {
      return "failed";
    }
    return "failed";
  }, [rawStatus]);

  useEffect(() => {
    const runVerification = async () => {
      if (!bookingId) {
        setStatus("failed");
        setMessage("Booking not found for payment verification.");
        return;
      }

      try {
        setStatus("loading");
        await verifyBookingPayment({
          bookingId,
          provider: provider === "khalti" || provider === "esewa" ? provider : undefined,
          paymentRef,
          status: normalizedStatus,
          pidx,
          transactionUuid,
          gatewayTxnId,
        });

        if (normalizedStatus === "success") {
          setStatus("success");
          setMessage("Payment successful. Your booking is confirmed.");
          return;
        }

        setStatus("failed");
        setMessage("Payment failed or was cancelled.");
      } catch (error: Error | any) {
        setStatus("failed");
        setMessage(error.message || "Payment verification failed.");
      }
    };

    runVerification();
  }, [bookingId, gatewayTxnId, normalizedStatus, pidx, provider, paymentRef, transactionUuid]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900">Payment Result</h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>

        {status === "loading" && (
          <p className="mt-6 text-sm text-blue-600">Verifying payment...</p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/user/bookings"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to My Bookings
          </Link>
          <button
            type="button"
            onClick={() => router.push("/tutors")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Tutors
          </button>
        </div>
      </div>
    </div>
  );
}
