"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyTutorBookings } from "@/lib/api/booking";

export default function TutorEarningsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getMyTutorBookings();
        setBookings(result.data || []);
      } catch {
        setBookings([]);
      }
    };

    
    fetchBookings();
  }, []);

  const stats = useMemo(() => {
    const paidBookings = bookings.filter((item) => item.paymentStatus === "paid");
    const totalEarnings = paidBookings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const pendingPayouts = bookings
      .filter((item) => item.paymentStatus !== "paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const completedSessions = bookings.filter((item) => item.bookingStatus === "completed").length;

    return {
      totalEarnings,
      pendingPayouts,
      completedSessions,
      paidBookings,
    };
  }, [bookings]);

  const totalPages = Math.max(1, Math.ceil(stats.paidBookings.length / ITEMS_PER_PAGE));
  const paginatedPaidBookings = stats.paidBookings.slice(
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
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Earnings & Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Earnings" value={`Rs ${stats.totalEarnings.toFixed(2)}`} icon="💰" />
        <StatCard title="Pending Payouts" value={`Rs ${stats.pendingPayouts.toFixed(2)}`} icon="⏳" />
        <StatCard title="Completed Sessions" value={String(stats.completedSessions)} icon="✅" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h2>
        {stats.paidBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">💳 No payment history yet</p>
            <p className="text-gray-400 mt-2">
              Payments will appear here as you complete sessions with students
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Duration</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedPaidBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.date || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.time || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                      {booking.studentId?.fullName || booking.studentId?.username || "Student"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{booking.duration || "-"}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-700">
                      Rs {Number(booking.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {stats.paidBookings.length > ITEMS_PER_PAGE && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              -{Math.min(currentPage * ITEMS_PER_PAGE, stats.paidBookings.length)} of {stats.paidBookings.length}
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
        - Payout history table
        - Filter by date range
        - Download invoice
        - Set payout method
        - View payment status
      */}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}
