"use client";

import { useEffect, useState } from "react";
import { whoAmI } from "@/lib/api/auth";

type TutorReview = {
  reviewerId?: string;
  name?: string;
  detail?: string;
  quote?: string;
  rating?: number;
};

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await whoAmI();
        setReviews(Array.isArray(result?.data?.reviews) ? result.data.reviews : []);
      } catch (err: Error | any) {
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-blue-600">My Reviews</h1>

      {loading && <p className="text-gray-500">Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          No reviews found.
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Reviewer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Detail</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Review</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review, index) => (
                <tr key={`${review.reviewerId || "review"}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{review.name || "Student"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{review.detail || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{review.quote || "-"}</td>
                  <td className="px-4 py-3 text-sm text-yellow-700">{review.rating || 0}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
