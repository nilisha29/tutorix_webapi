"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserById } from "@/lib/api/admin/user";
import Image from "next/image";
import Link from "next/link";

type User = {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
  subject?: string;
  gradeLevel?: string;
  pricePerHour?: number;
  rating?: number;
  reviewsCount?: number;
  about?: string;
  experienceYears?: number;
  responseTime?: string;
  languages?: string;
  tags?: string;
  education?: string;
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserById(userId);
        setUser(data);
      } catch (err: any) {
        console.error("Failed to fetch user", err);
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const getProfileImageUrl = (profileImage?: string) => {
    if (!profileImage) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    if (profileImage.startsWith("http")) {
      return profileImage.replace("10.0.2.2", "localhost");
    }
    return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <p className="font-medium">{error || "User not found"}</p>
        </div>
        <Link href="/admin/users" className="text-blue-600 hover:underline">
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">User Details</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            View and manage user information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/users/${userId}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <Link href="/admin/users" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium">
            ← Back
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 h-fit sticky top-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center">
            {user.profileImage ? (
              <Image
                src={getProfileImageUrl(user.profileImage) || ""}
                alt={user.fullName}
                width={120}
                height={120}
                className="rounded-full mx-auto mb-4 border-4 border-blue-200 shadow-sm"
              />
            ) : (
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-blue-200 shadow-sm mx-auto mb-4">
                  {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-800">{user.fullName}</h3>
            <p className="text-gray-600 text-sm">@{user.username}</p>
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
              {user.role === "admin" ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
              {user.role}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-3 space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Email</label>
                <a href={`mailto:${user.email}`} className="text-gray-700 text-sm hover:text-blue-600 break-all">
                  {user.email}
                </a>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone</label>
                <p className="text-gray-700 text-sm">{user.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Address</label>
                <p className="text-gray-700 text-sm">{user.address || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Join Date</label>
                <p className="text-gray-700 text-sm">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Tutor Info (if applicable) */}
          {user.role === "tutor" && (
            <>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Tutor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Subject</label>
                    <p className="text-gray-700 text-sm">{user.subject || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Grade Level</label>
                    <p className="text-gray-700 text-sm">{user.gradeLevel || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Price per Hour</label>
                    <p className="text-gray-700 text-sm">Rs {user.pricePerHour || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Experience Years</label>
                    <p className="text-gray-700 text-sm">{user.experienceYears || "N/A"} years</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Rating</label>
                    <p className="text-gray-700 text-sm">⭐ {user.rating || "N/A"}/5</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Reviews Count</label>
                    <p className="text-gray-700 text-sm">{user.reviewsCount || 0} reviews</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Response Time</label>
                    <p className="text-gray-700 text-sm">{user.responseTime || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Languages</label>
                    <p className="text-gray-700 text-sm">{user.languages || "N/A"}</p>
                  </div>
                </div>
              </div>

              {user.about && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">About</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{user.about}</p>
                </div>
              )}

              {user.tags && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(user.tags) ? user.tags : user.tags.split(",")).map((tag: string, idx: number) => (
                      <span key={idx} className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {typeof tag === "string" ? tag.trim() : tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}