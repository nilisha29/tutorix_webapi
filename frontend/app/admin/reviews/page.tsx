"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [userMap, setUserMap] = useState<Record<string, UserLite>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editQuote, setEditQuote] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Reviews Management</h2>
        <p className="text-gray-600">View, edit and delete tutor reviews</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading reviews...</div>
      ) : tutors.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-white rounded-xl border">No reviews found</div>
      ) : (
        <div className="space-y-6">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{tutor.fullName} <span className="text-sm text-gray-500">@{tutor.username}</span></h3>
              <div className="space-y-4">
                {(tutor.reviews || []).map((review, index) => {
                  const key = reviewKey(tutor._id, review.reviewerId, index);
                  const isEditing = editingKey === key;
                  const img = review.profileImage || (review.reviewerId ? userMap[review.reviewerId]?.profileImage : undefined);
                  return (
                    <div key={key} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <Image
                              src={getProfileImageUrl(img) || ""}
                              alt={review.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold">
                              {review.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                            <p className="text-xs text-gray-500">{review.detail}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, starIndex) => {
                            const active = starIndex < (review.rating || 5);
                            return (
                              <svg key={starIndex} className={`h-4 w-4 ${active ? "text-yellow-500" : "text-gray-300"}`} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
                              </svg>
                            );
                          })}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="mt-3 space-y-3">
                          <textarea
                            value={editQuote}
                            onChange={(event) => setEditQuote(event.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Rating:</span>
                            <select
                              value={editRating}
                              onChange={(event) => setEditRating(Number(event.target.value))}
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                            >
                              {[1, 2, 3, 4, 5].map((rate) => (
                                <option key={rate} value={rate}>{rate}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(tutor._id, review.reviewerId)}
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
                        </div>
                      ) : (
                        <>
                          <p className="mt-3 text-sm text-gray-700">{review.quote}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => startEdit(tutor._id, review, index)}
                              disabled={!review.reviewerId}
                              className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeReview(tutor._id, review.reviewerId, index)}
                              disabled={!review.reviewerId || deletingKey === key}
                              className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              {deletingKey === key ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
