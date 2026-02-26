"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyTutorBookings } from "@/lib/api/booking";

export default function TutorEarningsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

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
          <div className="space-y-3">
            {stats.paidBookings.map((booking) => (
              <div key={booking._id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700">Date: {booking.date}</p>
                <p className="text-sm text-gray-700">Student: {booking.studentId?.fullName || "Student"}</p>
                <p className="text-sm font-semibold text-green-700">Amount: Rs {Number(booking.amount || 0).toFixed(2)}</p>
              </div>
            ))}
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
