"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { deleteBookingByIdForAdmin, getBookingByIdForAdmin, updateBookingByIdForAdmin } from "@/lib/api/booking";

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "",
    amount: "0",
    paymentMethod: "esewa",
    paymentStatus: "pending",
    bookingStatus: "pending",
  });

  const createdAtText = useMemo(() => {
    if (!booking?.createdAt) return "-";
    const date = new Date(booking.createdAt);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  }, [booking]);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "edit") {
      setIsEditing(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getBookingByIdForAdmin(bookingId);
        const row = result?.data;
        setBooking(row);
        setFormData({
          date: row?.date || "",
          time: row?.time || "",
          duration: row?.duration || "",
          amount: String(row?.amount ?? 0),
          paymentMethod: row?.paymentMethod || "esewa",
          paymentStatus: row?.paymentStatus || "pending",
          bookingStatus: row?.bookingStatus || "pending",
        });
      } catch (err: Error | any) {
        setError(err.message || "Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const result = await updateBookingByIdForAdmin(bookingId, {
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod as "esewa" | "khalti",
        paymentStatus: formData.paymentStatus as "pending" | "paid" | "failed",
        bookingStatus: formData.bookingStatus as "pending" | "confirmed" | "cancelled" | "completed",
      });

      setBooking(result.data);
      setMessage("Booking updated successfully");
      setIsEditing(false);
    } catch (err: Error | any) {
      setMessage(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this booking?")) return;

    try {
      setDeleting(true);
      await deleteBookingByIdForAdmin(bookingId);
      router.replace("/admin/bookings");
    } catch (err: Error | any) {
      setMessage(err.message || "Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading booking...</div>;
  }

  if (error || !booking) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-600">{error || "Booking not found"}</p>
        <Link href="/admin/bookings" className="text-blue-600 hover:underline">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Booking Details</h1>
          <p className="text-gray-600">View and edit this booking on the same page.</p>
        </div>
        <Link href="/admin/bookings" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
          Back
        </Link>
      </div>

      {message && (
        <div className={`rounded-md px-4 py-3 text-sm ${message.toLowerCase().includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Student</label>
            <input value={booking.studentId?.fullName || "Student"} disabled className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Tutor</label>
            <input value={booking.tutorId?.fullName || "Tutor"} disabled className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Time</label>
            <input
              value={formData.time}
              onChange={(event) => setFormData((prev) => ({ ...prev, time: event.target.value }))}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Duration</label>
            <input
              value={formData.duration}
              onChange={(event) => setFormData((prev) => ({ ...prev, duration: event.target.value }))}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Amount</label>
            <input
              type="number"
              min="0"
              value={formData.amount}
              onChange={(event) => setFormData((prev) => ({ ...prev, amount: event.target.value }))}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(event) => setFormData((prev) => ({ ...prev, paymentMethod: event.target.value }))}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            >
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Payment Status</label>
            <select
              value={formData.paymentStatus}
              onChange={(event) => setFormData((prev) => ({ ...prev, paymentStatus: event.target.value }))}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Booking Status</label>
            <select
              value={formData.bookingStatus}
              onChange={(event) => setFormData((prev) => ({ ...prev, bookingStatus: event.target.value }))}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
              <option value="completed">completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Created At</label>
          <input value={createdAtText} disabled className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    date: booking.date || "",
                    time: booking.time || "",
                    duration: booking.duration || "",
                    amount: String(booking.amount ?? 0),
                    paymentMethod: booking.paymentMethod || "esewa",
                    paymentStatus: booking.paymentStatus || "pending",
                    bookingStatus: booking.bookingStatus || "pending",
                  });
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
