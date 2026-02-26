"use client";

import { useAuth } from "@/context/AuthContext";
import { useMemo, useState } from "react";
import { updateProfile } from "@/lib/api/auth";

const normalizeAvailabilitySlots = (slots: any[] | undefined) => {
  if (!Array.isArray(slots)) return [];
  return slots
    .map((slot) => {
      const day = String(slot?.day || "").trim();
      const times = Array.isArray(slot?.times) ? slot.times.map((time: string) => String(time).trim()).filter(Boolean) : [];
      if (!day || times.length === 0) return null;
      return { day, times };
    })
    .filter((slot): slot is { day: string; times: string[] } => !!slot);
};

export default function TutorProfilePage() {
  const { user, checkAuth } = useAuth();
  const initialAvailabilitySlots = useMemo(() => normalizeAvailabilitySlots(user?.availabilitySlots), [user?.availabilitySlots]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    about: user?.about || "",
    experienceYears: user?.experienceYears || 0,
    pricePerHour: user?.pricePerHour || 0,
    responseTime: user?.responseTime || "24 hours",
  });
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityTime, setAvailabilityTime] = useState("");
  const [availabilityTimes, setAvailabilityTimes] = useState<string[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<Array<{ day: string; times: string[] }>>(initialAvailabilitySlots);
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

  const addAvailabilityTime = () => {
    const time = availabilityTime.trim();
    if (!time) {
      throw new Error("Please choose a time");
    }

    if (availabilityTimes.includes(time)) {
      throw new Error("Time already added");
    }

    setAvailabilityTimes((prev) => [...prev, time]);
    setAvailabilityTime("");
  };

  const removeAvailabilityTime = (index: number) => {
    setAvailabilityTimes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addAvailabilitySlot = () => {
    const date = availabilityDate.trim();
    if (!date) {
      throw new Error("Please choose a date");
    }

    if (availabilityTimes.length === 0) {
      throw new Error("Please add at least one time");
    }

    const nextSlots = [...availabilitySlots, { day: date, times: availabilityTimes }];
    setAvailabilitySlots(nextSlots);
    setAvailabilityDate("");
    setAvailabilityTimes([]);
  };

  const removeAvailabilitySlot = (index: number) => {
    setAvailabilitySlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const startEditing = () => {
    setFormData({
      about: user?.about || "",
      experienceYears: user?.experienceYears || 0,
      pricePerHour: user?.pricePerHour || 0,
      responseTime: user?.responseTime || "24 hours",
    });
    setAvailabilitySlots(normalizeAvailabilitySlots(user?.availabilitySlots));
    setAvailabilityDate("");
    setAvailabilityTime("");
    setAvailabilityTimes([]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setAvailabilitySlots(normalizeAvailabilitySlots(user?.availabilitySlots));
    setAvailabilityDate("");
    setAvailabilityTime("");
    setAvailabilityTimes([]);
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();
      payload.append("about", String(formData.about || ""));
      payload.append("experienceYears", String(formData.experienceYears || 0));
      payload.append("pricePerHour", String(formData.pricePerHour || 0));
      payload.append("responseTime", String(formData.responseTime || ""));
      payload.append("availabilitySlots", JSON.stringify(availabilitySlots));

      const response = await updateProfile(payload);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to update profile");
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
              Hourly Rate (Rs)
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
              <p className="text-gray-700">Rs {user?.pricePerHour || "0.00"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Availability Time
            </label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="date"
                    value={availabilityDate}
                    onChange={(event) => setAvailabilityDate(event.target.value)}
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  />
                  <input
                    type="time"
                    value={availabilityTime}
                    onChange={(event) => setAvailabilityTime(event.target.value)}
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        addAvailabilityTime();
                        setMessage("");
                      } catch (error: Error | any) {
                        setMessage(error.message || "Invalid time");
                      }
                    }}
                    className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Add Time
                  </button>
                </div>

                {availabilityTimes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {availabilityTimes.map((time, index) => (
                      <button
                        key={`${time}-${index}`}
                        type="button"
                        onClick={() => removeAvailabilityTime(index)}
                        className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                      >
                        {time} x
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    try {
                      addAvailabilitySlot();
                      setMessage("");
                    } catch (error: Error | any) {
                      setMessage(error.message || "Invalid availability");
                    }
                  }}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Add Date
                </button>

                <div className="space-y-2">
                  {availabilitySlots.length > 0 ? (
                    availabilitySlots.map((slot, index) => (
                      <div key={`${slot.day}-${index}`} className="flex items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm">
                        <span>{slot.day} - {slot.times.join(", ")}</span>
                        <button
                          type="button"
                          onClick={() => removeAvailabilitySlot(index)}
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No availability added yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-gray-700">
                {Array.isArray(user?.availabilitySlots) && user.availabilitySlots.length > 0 ? (
                  user.availabilitySlots.map((slot: any, index: number) => (
                    <p key={`${slot?.day || "day"}-${index}`}>
                      <span className="font-semibold">{slot?.day}:</span> {Array.isArray(slot?.times) ? slot.times.join(", ") : "-"}
                    </p>
                  ))
                ) : (
                  <p>Not specified</p>
                )}
              </div>
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
                  onClick={cancelEditing}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={startEditing}
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
