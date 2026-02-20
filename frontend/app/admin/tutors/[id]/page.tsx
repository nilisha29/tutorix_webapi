"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserById, updateTutorReview, deleteTutorReview } from "@/lib/api/admin/user";
import Image from "next/image";
import Link from "next/link";

type Tutor = {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  role: string;
  profileImage?: string;
  createdAt?: string;
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
  availabilitySlots?: any[];
  reviews?: {
    reviewerId?: string;
    name: string;
    detail: string;
    profileImage?: string;
    quote: string;
    rating?: number;
  }[];
};

export default function TutorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tutorId = params.id as string;
  
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReviewerId, setEditingReviewerId] = useState<string | null>(null);
  const [editQuote, setEditQuote] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [savingReview, setSavingReview] = useState(false);
  const [deletingReviewerId, setDeletingReviewerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserById(tutorId);
        if (data.role !== "tutor") {
          setError("This user is not a tutor");
          return;
        }
        setTutor(data);
      } catch (err: any) {
        console.error("Failed to fetch tutor", err);
        setError(err.message || "Failed to load tutor");
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchTutor();
    }
  }, [tutorId]);

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

  const startEditReview = (review: NonNullable<Tutor["reviews"]>[number]) => {
    if (!review.reviewerId) return;
    setEditingReviewerId(review.reviewerId);
    setEditQuote(review.quote || "");
    setEditRating(review.rating || 5);
  };

  const cancelEditReview = () => {
    setEditingReviewerId(null);
    setEditQuote("");
    setEditRating(5);
  };

  const submitEditReview = async () => {
    if (!tutor || !editingReviewerId) return;
    try {
      setSavingReview(true);
      const updatedTutor = await updateTutorReview(tutor._id, editingReviewerId, {
        quote: editQuote,
        rating: editRating,
      });
      setTutor(updatedTutor);
      cancelEditReview();
    } catch (err: any) {
      alert(err.message || "Failed to update review");
    } finally {
      setSavingReview(false);
    }
  };

  const handleDeleteReview = async (reviewerId?: string) => {
    if (!tutor || !reviewerId) return;
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setDeletingReviewerId(reviewerId);
      const updatedTutor = await deleteTutorReview(tutor._id, reviewerId);
      setTutor(updatedTutor);
    } catch (err: any) {
      alert(err.message || "Failed to delete review");
    } finally {
      setDeletingReviewerId(null);
    }
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

  if (error || !tutor) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <p className="font-medium">{error || "Tutor not found"}</p>
        </div>
        <Link href="/admin/tutors" className="text-blue-600 hover:underline">
          ← Back to Tutors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Tutor Details</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            View and manage tutor information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/tutors/${tutorId}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <Link href="/admin/tutors" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium">
            ← Back
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 h-fit sticky top-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center">
            {tutor.profileImage ? (
              <Image
                src={getProfileImageUrl(tutor.profileImage) || ""}
                alt={tutor.fullName}
                width={120}
                height={120}
                className="rounded-full mx-auto mb-4 border-4 border-green-200 shadow-sm"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-green-200 shadow-sm mx-auto mb-4">
                {tutor.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-800">{tutor.fullName}</h3>
            <p className="text-gray-600 text-sm">@{tutor.username}</p>
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.218c0 1.3-.5 2.47-1.315 3.361-1.75-.992-3.8-1.559-6-1.559s-4.25.567-6 1.559C2.5 15.3 2 14.130 2 12.83V6.517a3.066 3.066 0 012.267-2.952z" clipRule="evenodd" />
              </svg>
              Tutor
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
                <a href={`mailto:${tutor.email}`} className="text-gray-700 text-sm hover:text-blue-600 break-all">
                  {tutor.email}
                </a>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone</label>
                <p className="text-gray-700 text-sm">{tutor.phoneNumber || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Join Date</label>
                <p className="text-gray-700 text-sm">{formatDate(tutor.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Tutor Info */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Teaching Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Subject</label>
                <p className="text-gray-700 text-sm">{tutor.subject || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Grade Level</label>
                <p className="text-gray-700 text-sm">{tutor.gradeLevel || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Price per Hour</label>
                <p className="text-gray-700 text-sm font-semibold text-green-600">${tutor.pricePerHour || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Experience Years</label>
                <p className="text-gray-700 text-sm">{tutor.experienceYears || "N/A"} years</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Rating</label>
                <p className="text-gray-700 text-sm">⭐ {tutor.rating || "N/A"}/5</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Reviews Count</label>
                <p className="text-gray-700 text-sm">{tutor.reviewsCount || 0} reviews</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Response Time</label>
                <p className="text-gray-700 text-sm">{tutor.responseTime || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Languages & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutor.languages && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(tutor.languages) ? tutor.languages : tutor.languages.split(",")).map((lang: string, idx: number) => (
                    <span key={idx} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {typeof lang === "string" ? lang.trim() : lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tutor.tags && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(tutor.tags) ? tutor.tags : tutor.tags.split(",")).map((tag: string, idx: number) => (
                    <span key={idx} className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {typeof tag === "string" ? tag.trim() : tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {tutor.about && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{tutor.about}</p>
            </div>
          )}

          {tutor.education && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Education</h3>
              <div className="space-y-2">
                {(Array.isArray(tutor.education) ? tutor.education : tutor.education.split("\n")).filter((e: string) => (typeof e === "string" ? e.trim() : e)).map((edu: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <p className="text-gray-700 text-sm">{edu.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Availability</h3>
            {tutor.availabilitySlots && tutor.availabilitySlots.length > 0 ? (
              <div className="space-y-3">
                {tutor.availabilitySlots.map((slot: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-700">{slot.day}</p>
                    <div className="flex flex-wrap gap-2">
                      {slot.times && slot.times.map((time: string, tidx: number) => (
                        <span key={tidx} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No availability slots added yet.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200">Reviews</h3>
            {tutor.reviews && tutor.reviews.length > 0 ? (
              <div className="space-y-4">
                {tutor.reviews.map((review, index) => {
                  const key = review.reviewerId || `${review.name}-${index}`;
                  const isEditing = editingReviewerId === review.reviewerId;
                  return (
                    <div key={key} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {review.profileImage ? (
                            <Image
                              src={getProfileImageUrl(review.profileImage) || ""}
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
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>{rating}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={submitEditReview}
                              disabled={savingReview}
                              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              {savingReview ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEditReview}
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
                              onClick={() => startEditReview(review)}
                              disabled={!review.reviewerId}
                              className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.reviewerId)}
                              disabled={!review.reviewerId || deletingReviewerId === review.reviewerId}
                              className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              {deletingReviewerId === review.reviewerId ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No reviews available for this tutor.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
