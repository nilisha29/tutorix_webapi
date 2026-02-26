"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getMyTutorBookings } from "@/lib/api/booking";

export default function TutorDashboard() {
  const { user } = useAuth();
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
    const totalBookings = bookings.length;
    const paidBookings = bookings.filter((item) => item.paymentStatus === "paid");
    const pendingPayments = bookings.filter((item) => item.paymentStatus !== "paid");
    const totalEarnings = paidBookings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const uniqueStudents = new Set(bookings.map((item) => String(item.studentId?._id || item.studentId || ""))).size;

    return {
      totalBookings,
      paidPayments: paidBookings.length,
      pendingPayments: pendingPayments.length,
      totalEarnings,
      uniqueStudents,
    };
  }, [bookings]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tutor Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome, {user?.fullName || user?.username}! Manage your tutoring profile, bookings, and earnings here.
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Profile Completion"
          value={user?.about ? "100%" : "50%"}
          icon="📋"
        />
        <StatCard
          title="Total Earnings"
          value={`Rs ${stats.totalEarnings.toFixed(2)}`}
          icon="💰"
        />
        <StatCard
          title="Bookings"
          value={String(stats.totalBookings)}
          icon="📅"
        />
        <StatCard
          title="Students"
          value={String(stats.uniqueStudents)}
          icon="👥"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Paid Payments</p>
          <p className="text-2xl font-bold text-green-700 mt-2">{stats.paidPayments}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Pending Payments</p>
          <p className="text-2xl font-bold text-amber-700 mt-2">{stats.pendingPayments}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            href="/tutor/profile"
            icon="✏️"
            title="Edit Profile"
            description="Update your tutor profile and availability"
          />
          <ActionButton
            href="/tutor/bookings"
            icon="📅"
            title="View Bookings"
            description="Manage your upcoming bookings"
          />
          <ActionButton
            href="/tutor/earnings"
            icon="💳"
            title="Earnings & Payments"
            description="Track your earnings and payouts"
          />
        </div>
      </div>
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

function ActionButton({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-500 transition"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
