"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function TutorDashboard() {
  const { user } = useAuth();

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
          value="$0.00"
          icon="💰"
        />
        <StatCard
          title="Bookings"
          value="0"
          icon="📅"
        />
        <StatCard
          title="Students"
          value="0"
          icon="👥"
        />
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
