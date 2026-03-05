"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleUpdateProfile } from "@/lib/actions/auth-action";

export default function AdminProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
    });
    setProfileImageFile(null);
    setProfileImagePreview(null);
  }, [user]);

  const getProfileImageUrl = (profileImage?: string | null) => {
    if (!profileImage) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    if (profileImage.startsWith("http")) {
      return profileImage;
    }
    return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfileImageFile(file);

    if (file && !isEditing) {
      setIsEditing(true);
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProfileImagePreview(null);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("address", formData.address);
      if (profileImageFile) {
        payload.append("profileImage", profileImageFile);
      }

      const result = await handleUpdateProfile(payload);
      if (!result?.success) {
        throw new Error(result?.message || "Failed to update profile");
      }

      if (result?.data) {
        setUser(result.data);
      }
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
    } catch (error: Error | any) {
      setMessage(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-600">Admin Profile</h1>
        <p className="text-gray-600 mt-1">View and update your admin profile details.</p>
      </div>

      {message && (
        <div className={`rounded-md px-4 py-3 text-sm ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Profile Picture</label>
          <div className="flex items-center gap-4">
            {profileImagePreview || user?.profileImage ? (
              <img
                src={profileImagePreview || getProfileImageUrl(user?.profileImage) || ""}
                alt={user?.fullName || "Admin"}
                className="h-20 w-20 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-300 text-white flex items-center justify-center text-xl font-semibold">
                {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="admin-profile-image"
                className="inline-block cursor-pointer rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Choose Image
              </label>
              <input
                id="admin-profile-image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500">JPG, PNG or WEBP up to 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setMessage("");
                  setFormData({
                    fullName: user?.fullName || "",
                    username: user?.username || "",
                    email: user?.email || "",
                    phoneNumber: user?.phoneNumber || "",
                    address: user?.address || "",
                  });
                  setProfileImageFile(null);
                  setProfileImagePreview(null);
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
