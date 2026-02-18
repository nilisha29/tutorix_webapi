"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function TutorDashboard() {
  const { user } = useAuth();

  const getProfileImageUrl = () => {
    const rawUrl = user?.profileImage || user?.imageUrl;
    if (!rawUrl) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const imageUrl = rawUrl.startsWith("http")
      ? rawUrl
      : `${baseUrl}${rawUrl}`;
    return imageUrl.replace("10.0.2.2", "localhost");
  };

  const getUserInitial = () => {
    const name = user?.fullName || user?.username || user?.email || "U";
    return name.charAt(0).toUpperCase();
  };

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

      {/* Profile Overview */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Overview</h2>
        
        <div className="flex items-start gap-8">
          {/* Profile Image */}
          <div>
            {getProfileImageUrl() ? (
              <img
                src={getProfileImageUrl()!}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-semibold">
                {getUserInitial()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {user?.fullName || user?.username}
            </h3>

            <div className="space-y-3 text-gray-700">
              <div>
                <span className="font-semibold">Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-semibold">Subject:</span> {user?.subject || "Not specified"}
              </div>
              <div>
                <span className="font-semibold">Grade Level:</span> {user?.gradeLevel || "Not specified"}
              </div>
              <div>
                <span className="font-semibold">Hourly Rate:</span> ${user?.pricePerHour || "0.00"}
              </div>
              <div>
                <span className="font-semibold">Experience:</span> {user?.experienceYears || 0} years
              </div>
              <div>
                <span className="font-semibold">Languages:</span> {
                  Array.isArray(user?.languages) 
                    ? user.languages.join(", ") 
                    : user?.languages ? user.languages.toString() : "Not specified"
                }
              </div>
              <div>
                <span className="font-semibold">About:</span>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {user?.about || "No bio added yet."}
                </p>
              </div>
            </div>

            <Link
              href="/tutor/profile"
              className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit Profile
            </Link>
          </div>
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
