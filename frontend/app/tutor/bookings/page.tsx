"use client";

import { useEffect, useState } from "react";
import { getMyTutorBookings } from "@/lib/api/booking";

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMyTutorBookings();
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
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-8">My Bookings</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {loading && <p className="text-gray-500">Loading bookings...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">📅 No bookings yet</p>
            <p className="text-gray-400 mt-2">
              Your bookings will appear here once students schedule sessions with you
            </p>
          </div>
        )}

        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-800">Student: {booking.studentId?.fullName || "Student"}</p>
              <p className="text-sm text-gray-600">Date: {booking.date}</p>
              <p className="text-sm text-gray-600">Time: {booking.time}</p>
              <p className="text-sm text-gray-600">Duration: {booking.duration}</p>
              <p className="text-sm text-gray-600">Payment: {booking.paymentMethod} ({booking.paymentStatus})</p>
              <p className="text-sm font-semibold text-green-700">Amount: ${booking.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future implementation can include:
        - List of upcoming bookings
        - Filter by date/status
        - Accept/reject booking requests
        - Mark sessions as completed
        - Student details
      */}
    </div>
  );
}
