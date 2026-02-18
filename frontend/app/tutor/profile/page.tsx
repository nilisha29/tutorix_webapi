"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TutorProfilePage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    about: user?.about || "",
    experienceYears: user?.experienceYears || 0,
    pricePerHour: user?.pricePerHour || 0,
    responseTime: user?.responseTime || "24 hours",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experienceYears" || name === "pricePerHour" 
        ? parseFloat(value) 
        : value,
    }));
  };

  const handleSave = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
      
      const response = await fetch(`${baseUrl}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await checkAuth();
      setMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Edit Tutor Profile</h1>

      {message && (
        <div
          className={`p-4 rounded-md mb-6 ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <div className="space-y-6">
          {/* About */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              About You
            </label>
            {isEditing ? (
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <p className="text-gray-700">{user?.about || "No bio added"}</p>
            )}
          </div>

          {/* Experience Years */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Years of Experience
            </label>
            {isEditing ? (
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-700">{user?.experienceYears || 0} years</p>
            )}
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-700">${user?.pricePerHour || "0.00"}</p>
            )}
          </div>

          {/* Response Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Typical Response Time
            </label>
            {isEditing ? (
              <select
                name="responseTime"
                value={formData.responseTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="1 hour">1 hour</option>
                <option value="4 hours">4 hours</option>
                <option value="12 hours">12 hours</option>
                <option value="24 hours">24 hours</option>
                <option value="2 days">2 days</option>
              </select>
            ) : (
              <p className="text-gray-700">{user?.responseTime || "Not specified"}</p>
            )}
          </div>

          {/* Subject & Grade Level (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <p className="text-gray-700">{user?.subject || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grade Level
              </label>
              <p className="text-gray-700">{user?.gradeLevel || "Not specified"}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
