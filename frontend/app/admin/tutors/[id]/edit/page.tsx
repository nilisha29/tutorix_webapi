"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/lib/api/admin/user";
import EditTutorForm from "../../_components/EditTutorForm";
import Link from "next/link";

export default function EditTutorPage() {
  const params = useParams();
  const tutorId = params.id as string;
  
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Edit Tutor</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Update tutor information
          </p>
        </div>
        <Link href="/admin/tutors" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium">
          ← Back
        </Link>
      </div>

      {/* Form */}
      <EditTutorForm tutorId={tutorId} initialData={tutor} />
    </div>
  );
}
