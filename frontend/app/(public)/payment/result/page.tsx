"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyBookingPayment } from "@/lib/api/booking";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "pending" | "success" | "failed" | "cancelled">("idle");
  const [message, setMessage] = useState("Processing payment result...");
  const [resolvedTxnId, setResolvedTxnId] = useState<string | undefined>(undefined);

  const bookingId = searchParams.get("bookingId") || undefined;
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
    if (["cancel", "cancelled", "canceled", "abort", "aborted"].includes(rawStatus)) {
      return "cancelled";
    }
    if (["failed", "failure", "error"].includes(rawStatus)) {
      return "failed";
    }
    return "unknown";
  }, [rawStatus]);

  useEffect(() => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const runVerification = async () => {
      if (!bookingId && !paymentRef && !transactionUuid) {
        setStatus("failed");
        setMessage("Payment reference is missing for verification.");
        return;
      }

      try {
        const maxAttempts = 4;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          setStatus("loading");

          const verifyResponse = await verifyBookingPayment({
            bookingId,
            provider: provider === "khalti" || provider === "esewa" ? provider : undefined,
            paymentRef,
            status: normalizedStatus === "unknown" ? undefined : normalizedStatus,
            pidx,
            transactionUuid,
            gatewayTxnId,
          });

          const verified = Boolean(verifyResponse?.data?.verified);
          const paymentStatus = String(verifyResponse?.data?.payment?.status || "").toLowerCase();
          const paymentGatewayTxnId =
            verifyResponse?.data?.payment?.gatewayTxnId ||
            verifyResponse?.data?.booking?.gatewayTxnId ||
            undefined;

          if (paymentGatewayTxnId) {
            setResolvedTxnId(String(paymentGatewayTxnId));
          }

          if (verified || paymentStatus === "paid") {
            setStatus("success");
            setMessage("Payment successful. Your booking is confirmed.");
            return;
          }

          if (paymentStatus === "pending") {
            setStatus("pending");
            setMessage("Payment is being processed. Please wait...");

            if (attempt < maxAttempts) {
              await delay(1500);
              continue;
            }

            setMessage("Payment is still processing. Please check My Bookings in a moment.");
            return;
          }

          if (normalizedStatus === "cancelled") {
            setStatus("cancelled");
            setMessage("Payment was cancelled.");
            return;
          }

          if (paymentStatus === "failed" && normalizedStatus === "success" && attempt < maxAttempts) {
            setStatus("pending");
            setMessage("Payment confirmation is still syncing. Retrying verification...");
            await delay(1500);
            continue;
          }

          if (normalizedStatus === "failed" || paymentStatus === "failed") {
            setStatus("failed");
            setMessage("Payment failed or was cancelled.");
            return;
          }

          if (attempt < maxAttempts) {
            await delay(1200);
          }
        }

        setStatus("failed");
        setMessage("Payment verification could not be completed. Please check My Bookings.");
      } catch (error: Error | any) {
        setStatus("failed");
        const backendMessage = error?.response?.data?.message;
        setMessage(backendMessage || error.message || "Payment verification failed.");
      }
    };

    runVerification();
  }, [bookingId, gatewayTxnId, normalizedStatus, pidx, provider, paymentRef, transactionUuid]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900">Payment Result</h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-xs text-slate-700">
          <p><span className="font-semibold">Booking ID:</span> {bookingId || "-"}</p>
          <p><span className="font-semibold">Reference:</span> {paymentRef || transactionUuid || "-"}</p>
          <p><span className="font-semibold">Transaction ID:</span> {resolvedTxnId || gatewayTxnId || "-"}</p>
        </div>

        {status === "loading" && (
          <p className="mt-6 text-sm text-blue-600">Verifying payment...</p>
        )}

        {status === "pending" && (
          <p className="mt-6 text-sm text-amber-600">Payment is processing...</p>
        )}

        {status === "cancelled" && (
          <p className="mt-6 text-sm text-orange-600">Payment was cancelled.</p>
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
