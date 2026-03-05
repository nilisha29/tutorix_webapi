"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMySavedTutors, removeSavedTutor } from "@/lib/api/saved-tutor";

const getProfileImageUrl = (profileImage?: string) => {
  if (!profileImage) return "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  if (profileImage.startsWith("http")) return profileImage.replace("10.0.2.2", "localhost");
  return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
};

const getInitial = (name?: string) => {
  return String(name || "T").trim().charAt(0).toUpperCase() || "T";
};


export default function UserSavedTutorsPage() {
  const [savedTutors, setSavedTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedTutors = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMySavedTutors();
      setSavedTutors(result.data || []);
    } catch (err: Error | any) {
      setError(err.message || "Failed to load saved tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedTutors();
  }, []);

  const handleRemove = async (tutorId: string) => {
    try {
      await removeSavedTutor(tutorId);
      await fetchSavedTutors();
    } catch (err: Error | any) {
      setError(err.message || "Failed to remove saved tutor");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Tutors</h1>
          <p className="mt-1 text-sm text-slate-500">Quick access to tutors you bookmarked.</p>
        </div>
        {!loading && savedTutors.length > 0 && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {savedTutors.length} saved
          </span>
        )}
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading saved tutors...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && savedTutors.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-600 font-medium">No saved tutors yet</p>
          <p className="mt-1 text-sm text-slate-500">Browse tutors and save your favorites here.</p>
          <Link
            href="/tutors"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Explore Tutors
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {savedTutors.map((item) => {
          const tutor = item.tutorId;
          const tutorName = tutor?.fullName || tutor?.username || "Tutor";
          const tutorImage = tutor?.profileImage || "";
          const tutorRating = typeof tutor?.rating === "number" ? tutor.rating.toFixed(1) : null;

          return (
            <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {tutorImage ? (
                    <img
                      src={getProfileImageUrl(tutorImage)}
                      alt={tutorName}
                      className="h-14 w-14 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center">
                      {getInitial(tutorName)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{tutorName}</p>
                    <p className="truncate text-sm text-slate-600">{tutor?.subject || "Subject not specified"}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      {tutorRating ? <span>★ {tutorRating}</span> : null}
                      {typeof tutor?.pricePerHour === "number" ? <span>NPR {tutor.pricePerHour}/hr</span> : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/tutors/${tutor?._id}`}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(String(tutor?._id || ""))}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
