"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllBookingsForAdmin } from "@/lib/api/booking";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllBookingsForAdmin();
        setBookings(result.data || []);
      } catch (err: Error | any) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return bookings;

    return bookings.filter((booking) => {
      const student = String(booking.studentId?.fullName || booking.studentId?.username || "").toLowerCase();
      const tutor = String(booking.tutorId?.fullName || booking.tutorId?.username || "").toLowerCase();
      const date = String(booking.date || "").toLowerCase();
      const paymentMethod = String(booking.paymentMethod || "").toLowerCase();
      const paymentStatus = String(booking.paymentStatus || "").toLowerCase();
      const bookingStatus = String(booking.bookingStatus || "").toLowerCase();
      return (
        student.includes(term) ||
        tutor.includes(term) ||
        date.includes(term) ||
        paymentMethod.includes(term) ||
        paymentStatus.includes(term) ||
        bookingStatus.includes(term)
      );
    });
  }, [bookings, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [currentPage, filteredBookings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-blue-600">All Bookings</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by student, tutor, date, payment or status"
          className="w-full md:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
      </div>

      {loading && <p className="text-gray-500">Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredBookings.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          No bookings found.
        </div>
      )}

      {!loading && !error && filteredBookings.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Tutor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Booking</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{booking.studentId?.fullName || "Student"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{booking.tutorId?.fullName || "Tutor"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{booking.date || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{booking.time || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{booking.duration || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {(booking.paymentMethod || "-").toString()} ({(booking.paymentStatus || "-").toString()})
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{booking.bookingStatus || "-"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">Rs {booking.amount || 0}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredBookings.length)} of {filteredBookings.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
