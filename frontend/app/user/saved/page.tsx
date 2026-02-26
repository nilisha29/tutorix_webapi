"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMySavedTutors, removeSavedTutor } from "@/lib/api/saved-tutor";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Tutors</h1>

      {loading && <p className="text-gray-500">Loading saved tutors...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && savedTutors.length === 0 && (
        <p className="text-gray-500">No saved tutors yet.</p>
      )}

      <div className="space-y-3">
        {savedTutors.map((item) => {
          const tutor = item.tutorId;
          return (
            <div key={item._id} className="rounded-lg border border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{tutor?.fullName || tutor?.username || "Tutor"}</p>
                  <p className="text-sm text-gray-600">{tutor?.subject || "Subject not specified"}</p>
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
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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
