"use client";

import { useAuth } from "@/context/AuthContext";

export default function TutorHeader() {
  const { user, logout } = useAuth();

  const getProfileImageUrl = () => {
    const rawUrl = user?.profileImage || user?.imageUrl;
    if (!rawUrl) return "";
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const imageUrl = rawUrl.startsWith("http") ? rawUrl : `${baseUrl}${rawUrl}`;
    return imageUrl.replace("10.0.2.2", "localhost");
  };

  const displayName = user?.fullName || user?.username || "Tutor";

  return (
    <header className="fixed top-0 left-0 xl:left-64 right-0 h-16 border-b border-emerald-800 bg-emerald-900 z-40 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-emerald-50">Tutor Dashboard</h1>
      <div className="flex items-center gap-3">
        {getProfileImageUrl() ? (
          <img
            src={getProfileImageUrl()}
            alt={displayName}
            className="h-9 w-9 rounded-full object-cover border border-emerald-700"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-emerald-700 text-emerald-50 text-sm font-semibold flex items-center justify-center">
            {String(displayName).charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-emerald-100">
          {displayName}
        </span>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-900 text-sm font-medium hover:bg-emerald-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
