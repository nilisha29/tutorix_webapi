"use client";

import { useAuth } from "@/context/AuthContext";

export default function TutorHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 xl:left-64 right-0 h-16 border-b border-gray-200 bg-white z-40 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">Tutor Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {user?.fullName || user?.username}
        </span>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
