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

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-gray-800">Tutor: {booking.tutorId?.fullName || "Tutor"}</p>
            <p className="text-sm text-gray-600">Date: {booking.date}</p>
            <p className="text-sm text-gray-600">Time: {booking.time}</p>
            <p className="text-sm text-gray-600">Duration: {booking.duration}</p>
            <p className="text-sm text-gray-600">Payment: {booking.paymentMethod} ({booking.paymentStatus})</p>
            <p className="text-sm font-semibold text-green-700">Amount: ${booking.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
