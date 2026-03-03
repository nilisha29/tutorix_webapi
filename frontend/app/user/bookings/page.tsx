"use client";

import { useEffect, useState } from "react";
import { getMyStudentBookings } from "@/lib/api/booking";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMyStudentBookings();
        setBookings(result.data || []);
      } catch (err: Error | any) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

 
    
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-blue-600">My Book Sessions</h1>

      {loading && <p className="text-gray-500">Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          No bookings yet.
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Booking ID</th>
              <th className="px-4 py-3 font-semibold">Tutor</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Method</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 font-semibold">Booking</th>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Transaction ID</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t border-gray-100 text-slate-700">
                <td className="px-4 py-3 font-mono text-xs">{booking._id || "-"}</td>
                <td className="px-4 py-3">{booking.tutorId?.fullName || "Tutor"}</td>
                <td className="px-4 py-3">{booking.date || "-"}</td>
                <td className="px-4 py-3">{booking.time || "-"}</td>
                <td className="px-4 py-3">{booking.duration || "-"}</td>
                <td className="px-4 py-3 uppercase">{booking.paymentMethod || "-"}</td>
                <td className="px-4 py-3">{booking.paymentStatus || "-"}</td>
                <td className="px-4 py-3">{booking.bookingStatus || "-"}</td>
                <td className="px-4 py-3 font-mono text-xs">{booking.paymentRef || "-"}</td>
                <td className="px-4 py-3 font-mono text-xs">{booking.gatewayTxnId || "-"}</td>
                <td className="px-4 py-3 font-semibold text-green-700">Rs {booking.amount ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
