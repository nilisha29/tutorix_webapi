"use client";

import { useEffect, useState } from "react";
import { getMyTutorBookings } from "@/lib/api/booking";

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 5;

  
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

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

        {!loading && !error && bookings.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Booking</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{booking.studentId?.fullName || "Student"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.duration}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.paymentMethod} ({booking.paymentStatus})</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.bookingStatus || "pending"}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">Rs {booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && bookings.length > ITEMS_PER_PAGE && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              -{Math.min(currentPage * ITEMS_PER_PAGE, bookings.length)} of {bookings.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-xs font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
