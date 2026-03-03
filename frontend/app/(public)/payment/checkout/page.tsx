"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { initiateBookingPayment } from "@/lib/api/booking";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [fullName, setFullName] = useState(String(user?.fullName || ""));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const tutorId = searchParams.get("tutorId") || "";
  const tutorName = searchParams.get("tutorName") || "Tutor";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const duration = searchParams.get("duration") || "60 min";
  const method = (searchParams.get("paymentMethod") || "esewa").toLowerCase() === "khalti" ? "khalti" : "esewa";
  const amount = Number(searchParams.get("amount") || 0);

  const amountLabel = useMemo(() => {
    if (!Number.isFinite(amount)) return "0.00";
    return amount.toFixed(2);
  }, [amount]);

  const handleComplete = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first to continue payment");
      router.push("/login");
      return;
    }

    if (!tutorId || !date || !time || !duration || !Number.isFinite(amount) || amount <= 0) {
      toast.error("Missing booking details. Please go back and try again.");
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim()) {
      toast.error("Please fill full name, phone number, and address.");
      return;
    }

    setProcessing(true);
    try {
      const response = await initiateBookingPayment({
        tutorId,
        date,
        time,
        duration,
        paymentMethod: method,
        amount,
      });

      const redirectUrl = response?.data?.redirectUrl;
      const redirectMethod = response?.data?.redirectMethod;
      const redirectFormFields = response?.data?.redirectFormFields;

      if (!redirectUrl) {
        throw new Error("Payment redirect URL not found");
      }

      if (redirectMethod === "POST" && redirectFormFields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = redirectUrl;

        Object.entries(redirectFormFields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      window.location.href = redirectUrl;
    } catch (error: Error | any) {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || error.message || "Failed to initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    const cancelParams = new URLSearchParams({
      provider: method,
      status: "cancelled",
    });
    router.push(`/payment/result?${cancelParams.toString()}`);
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
        <p className="mt-2 text-sm text-slate-600">Confirm your booking details before gateway payment.</p>

        <div className="mt-5 rounded-xl bg-white p-4 border border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Tutor</span>
            <span className="font-semibold">{tutorName || "-"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
            <span>Date & Time</span>
            <span className="font-semibold">{date && time ? `${date} ${time}` : "-"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
            <span>Duration</span>
            <span className="font-semibold">{duration || "-"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
            <span>Amount</span>
            <span className="font-semibold">NPR {amountLabel}</span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full Name"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
          />
          <input
            type="text"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="Mobile Number"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
          />
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Address"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
          />
          <p className="text-xs text-slate-500">
            You selected: <span className="font-semibold">{method === "esewa" ? "eSewa" : "Khalti"}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={processing}
          className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-70 ${buttonClass}`}
        >
          {processing ? "Redirecting..." : `Pay via ${method === "esewa" ? "eSewa" : "Khalti"}`}
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
