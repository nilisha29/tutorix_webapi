"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllUsers, updateTutorReview, deleteTutorReview } from "@/lib/api/admin/user";

type Review = {
  reviewerId?: string;
  name: string;
  detail: string;
  profileImage?: string;
  quote: string;
  rating?: number;
};

type Tutor = {
  _id: string;
  fullName: string;
  username: string;
  role: string;
  reviews?: Review[];
};

type UserLite = {
  _id: string;
  profileImage?: string;
};

export default function AdminReviewsPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [userMap, setUserMap] = useState<Record<string, UserLite>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editQuote, setEditQuote] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const pageSize = 10;

  const getProfileImageUrl = (profileImage?: string) => {
    if (!profileImage) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    if (profileImage.startsWith("http")) {
      return profileImage.replace("10.0.2.2", "localhost");
    }
    return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await getAllUsers();
      const nextUserMap: Record<string, UserLite> = {};
      for (const user of users || []) {
        nextUserMap[user._id] = { _id: user._id, profileImage: user.profileImage };
      }
      setUserMap(nextUserMap);

      const tutorList = (users || []).filter((user: Tutor) => user.role === "tutor" && Array.isArray(user.reviews) && user.reviews.length > 0);
      setTutors(tutorList);
    } catch (err: Error | any) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const reviewKey = (tutorId: string, reviewerId?: string, index?: number) => `${tutorId}-${reviewerId || `idx-${index || 0}`}`;

  const startEdit = (tutorId: string, review: Review, index: number) => {
    if (!review.reviewerId) return;
    setEditingKey(reviewKey(tutorId, review.reviewerId, index));
    setEditQuote(review.quote || "");
    setEditRating(review.rating || 5);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditQuote("");
    setEditRating(5);
  };

  const saveEdit = async (tutorId: string, reviewerId?: string) => {
    if (!reviewerId) return;
    try {
      setSaving(true);
      const updatedTutor = await updateTutorReview(tutorId, reviewerId, { quote: editQuote, rating: editRating });
      setTutors((prev) => prev.map((tutor) => (tutor._id === tutorId ? { ...tutor, reviews: updatedTutor.reviews } : tutor)));
      cancelEdit();
    } catch (err: Error | any) {
      alert(err.message || "Failed to update review");
    } finally {
      setSaving(false);
    }
  };

  const removeReview = async (tutorId: string, reviewerId?: string, index?: number) => {
    if (!reviewerId) return;
    if (!confirm("Delete this review?")) return;
    const key = reviewKey(tutorId, reviewerId, index);
    try {
      setDeletingKey(key);
      const updatedTutor = await deleteTutorReview(tutorId, reviewerId);
      setTutors((prev) => prev.map((tutor) => (tutor._id === tutorId ? { ...tutor, reviews: updatedTutor.reviews } : tutor)).filter((tutor) => (tutor.reviews?.length || 0) > 0));
    } catch (err: Error | any) {
      alert(err.message || "Failed to delete review");
    } finally {
      setDeletingKey(null);
    }
  };

  const reviewRows = useMemo(() => {
    return tutors.flatMap((tutor) =>
      (tutor.reviews || []).map((review, index) => ({
        tutorId: tutor._id,
        tutorName: tutor.fullName,
        tutorUsername: tutor.username,
        review,
        index,
        key: reviewKey(tutor._id, review.reviewerId, index),
      }))
    );
  }, [tutors]);

  const filteredReviewRows = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return reviewRows;

    return reviewRows.filter((row) => {
      const tutorName = String(row.tutorName || "").toLowerCase();
      const tutorUsername = String(row.tutorUsername || "").toLowerCase();
      const reviewerName = String(row.review.name || "").toLowerCase();
      const detail = String(row.review.detail || "").toLowerCase();
      const quote = String(row.review.quote || "").toLowerCase();
      return (
        tutorName.includes(term) ||
        tutorUsername.includes(term) ||
        reviewerName.includes(term) ||
        detail.includes(term) ||
        quote.includes(term)
      );
    });
  }, [reviewRows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredReviewRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviewRows.slice(start, start + pageSize);
  }, [currentPage, filteredReviewRows]);

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
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Reviews Management</h2>
        <p className="text-gray-600">View, edit and delete tutor reviews</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by tutor, reviewer, detail or review text"
          className="w-full md:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading reviews...</div>
      ) : filteredReviewRows.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-white rounded-xl border">No reviews found</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Tutor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Reviewer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Detail</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Review</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Rating</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRows.map((row) => {
                const { tutorId, tutorName, tutorUsername, review, key, index } = row;
                const isEditing = editingKey === key;
                const img = review.profileImage || (review.reviewerId ? userMap[review.reviewerId]?.profileImage : undefined);

                return (
                  <tr key={key} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {tutorName}
                      <div className="text-xs text-gray-500">@{tutorUsername}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        {img ? (
                          <Image
                            src={getProfileImageUrl(img) || ""}
                            alt={review.name}
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-semibold">
                            {review.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                        <span>{review.name || "User"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{review.detail || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 min-w-65">
                      {isEditing ? (
                        <textarea
                          value={editQuote}
                          onChange={(event) => setEditQuote(event.target.value)}
                          rows={3}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      ) : (
                        review.quote || "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-yellow-700 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editRating}
                          onChange={(event) => setEditRating(Number(event.target.value))}
                          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                        >
                          {[1, 2, 3, 4, 5].map((rate) => (
                            <option key={rate} value={rate}>{rate}</option>
                          ))}
                        </select>
                      ) : (
                        `${review.rating || 5}/5`
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => saveEdit(tutorId, review.reviewerId)}
                            disabled={saving}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/tutors/${tutorId}`)}
                            className="rounded-md bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/admin/tutors/${tutorId}`)}
                            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeReview(tutorId, review.reviewerId, index)}
                            disabled={!review.reviewerId || deletingKey === key}
                            className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                          >
                            {deletingKey === key ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>


          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredReviewRows.length)} of {filteredReviewRows.length}
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
