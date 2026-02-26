"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, deleteUser } from "@/lib/api/admin/user";
import Image from "next/image";

type Tutor = {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  role: string;
  profileImage?: string;
  subject?: string;
  gradeLevel?: string;
  pricePerHour?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
};

export default function TutorManagementPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const pageSize = 8;

  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      const tutorList = (data || []).filter((user: Tutor) => user.role === "tutor");
      setTutors(tutorList);
    } catch (err: Error | any) {
      setError(err.message || "Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const filteredTutors = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return tutors;

    return tutors.filter((tutor) => {
      const name = tutor.fullName?.toLowerCase() || "";
      const username = tutor.username?.toLowerCase() || "";
      const email = tutor.email?.toLowerCase() || "";
      const subject = tutor.subject?.toLowerCase() || "";
      return name.includes(term) || username.includes(term) || email.includes(term) || subject.includes(term);
    });
  }, [searchQuery, tutors]);

  const totalPages = Math.max(1, Math.ceil(filteredTutors.length / pageSize));

  const paginatedTutors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTutors.slice(start, start + pageSize);
  }, [currentPage, filteredTutors]);

  const tutorStats = useMemo(() => {
    const totalTutors = tutors.length;
    const activeSubjects = new Set(
      tutors
        .map((item) => String(item.subject || "").trim())
        .filter(Boolean)
    ).size;

    const pricedTutors = tutors.filter((item) => typeof item.pricePerHour === "number");
    const avgPrice = pricedTutors.length
      ? pricedTutors.reduce((sum, item) => sum + Number(item.pricePerHour || 0), 0) / pricedTutors.length
      : 0;

    const recentTutors = tutors.filter((item) => {
      if (!item.createdAt) return false;
      const createdAt = new Date(item.createdAt).getTime();
      if (Number.isNaN(createdAt)) return false;
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return createdAt >= sevenDaysAgo;
    }).length;

    return { totalTutors, activeSubjects, avgPrice, recentTutors };
  }, [tutors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id: string, fullName: string) => {
    if (!confirm(`Are you sure you want to delete tutor "${fullName}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteUser(id);
      setTutors(tutors.filter((tutor) => tutor._id !== id));
    } catch (err: Error | any) {
      alert(err.message || "Failed to delete tutor");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = () => {
    router.push("/admin/tutors/create");
  };

  const handleView = (id: string) => {
    router.push(`/admin/tutors/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/tutors/${id}/edit`);
  };

  const getProfileImageUrl = (profileImage?: string) => {
    if (!profileImage) return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

    if (profileImage.startsWith("http")) {
      return profileImage.replace("10.0.2.2", "localhost");
    }

    return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Tutors Management</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Manage tutor profiles and availability
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Tutor
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Tutors</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{tutorStats.totalTutors}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Active Subjects</p>
          <p className="mt-1 text-2xl font-bold text-indigo-700">{tutorStats.activeSubjects}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Avg. Hourly Price</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">Rs {tutorStats.avgPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500">New (7 Days)</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{tutorStats.recentTutors}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tutors by name, username, email or subject"
            className="w-full md:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading tutors...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedTutors.map((tutor, index) => (
                  <tr key={tutor._id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {tutor.profileImage ? (
                          <Image
                            src={getProfileImageUrl(tutor.profileImage) || ""}
                            alt={tutor.fullName}
                            width={36}
                            height={36}
                            className="rounded-full object-cover border-2 border-blue-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs border-2 border-blue-200 shadow-sm">
                            {tutor.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{tutor.fullName}</p>
                          <p className="text-xs text-gray-500">@{tutor.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${tutor.email}`} className="text-gray-700 text-sm hover:text-blue-600">
                        {tutor.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {tutor.phoneNumber ? (
                        <span className="text-gray-700 text-sm">{tutor.phoneNumber}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {tutor.subject ? (
                        <span className="text-gray-700 text-sm">{tutor.subject}</span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {tutor.pricePerHour !== undefined ? (
                        <span className="text-gray-700 text-sm">Rs {tutor.pricePerHour}/hr</span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleView(tutor._id)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:shadow-md transition-all text-xs font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(tutor._id)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:shadow-md transition-all text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tutor._id, tutor.fullName)}
                          disabled={deletingId === tutor._id}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                        >
                          {deletingId === tutor._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTutors.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <p className="text-gray-500 font-medium text-lg">No tutors found</p>
                      <p className="text-gray-400 text-sm">Create a tutor to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredTutors.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredTutors.length)} of {filteredTutors.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
