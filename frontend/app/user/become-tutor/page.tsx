"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserEditData, UserEditSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleBecomeTutor } from "@/lib/actions/admin/user-action";

export default function BecomeTutorPage() {
  const router = useRouter();
  const { user, checkAuth, setUser } = useAuth();
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserEditData>({
    resolver: zodResolver(UserEditSchema) as any,
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      subject: "",
      gradeLevel: "",
      pricePerHour: 0 as any,
      rating: 5 as any,
      reviewsCount: 0 as any,
      about: "",
      experienceYears: 0 as any,
      responseTime: "",
      languages: "",
      tags: "",
      education: "",
      availabilitySlots: "",
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityTime, setAvailabilityTime] = useState("");
  const [availabilityTimes, setAvailabilityTimes] = useState<string[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<{ day: string; times: string[] }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.profileImage) {
      setPreviewImage(user.profileImage);
    }
  }, [user]);

  const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addAvailabilityTime = () => {
    if (!availabilityTime.trim()) {
      toast.error("Time is required");
      return;
    }
    setAvailabilityTimes((prev) => [...prev, availabilityTime]);
    setAvailabilityTime("");
  };

  const removeAvailabilityTime = (index: number) => {
    setAvailabilityTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const addAvailabilitySlot = () => {
    if (!availabilityDate) {
      toast.error("Date is required");
      return;
    }
    if (availabilityTimes.length === 0) {
      toast.error("At least one time slot is required");
      return;
    }

    const dateObj = new Date(availabilityDate);
    const day = dateObj.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" });

    setAvailabilitySlots((prev) => [
      ...prev,
      { day, times: [...availabilityTimes] }
    ]);

    setAvailabilityDate("");
    setAvailabilityTimes([]);
  };

  const removeAvailabilitySlot = (index: number) => {
    setAvailabilitySlots((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<UserEditData> = async (data) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        
        if (data.subject) formData.append('subject', data.subject);
        if (data.gradeLevel) formData.append('gradeLevel', data.gradeLevel);
        if (data.pricePerHour) formData.append('pricePerHour', String(data.pricePerHour));
        if (data.about) formData.append('about', data.about);
        if (data.experienceYears) formData.append('experienceYears', String(data.experienceYears));
        if (data.responseTime) formData.append('responseTime', data.responseTime);
        if (data.languages) {
          const languages = Array.isArray(data.languages) ? data.languages.join(", ") : data.languages;
          formData.append('languages', languages);
        }
        if (data.tags) {
          const tags = Array.isArray(data.tags) ? data.tags.join(", ") : data.tags;
          formData.append('tags', tags);
        }
        if (data.education) {
          const education = Array.isArray(data.education) ? data.education.join("\n") : data.education;
          formData.append('education', education);
        }
        if (availabilitySlots.length > 0) {
          formData.append('availabilitySlots', JSON.stringify(availabilitySlots));
        }
        if (data.image) {
          formData.append('profileImage', data.image);
        }

        const response = await handleBecomeTutor(formData);

        if (!response.success) {
          throw new Error(response.message || "Failed to become a tutor");
        }

        // Update the user in context with new role
        if (response.data) {
          setUser({ ...user, ...response.data, role: response.data.role || "tutor" });
        }

        await checkAuth();
        toast.success("Welcome to the tutor community! Redirecting to dashboard...");
        
        // Refresh the page to show updated navbar with tutor dashboard link
        setTimeout(() => {
          window.location.href = "/user/dashboard";
        }, 1500);

      } catch (error: Error | any) {
        const errorMsg = error.message || "Failed to become a tutor";
        toast.error(errorMsg);
        setError(errorMsg);
      }
    });
  };

  if (user?.role === "tutor") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            You are already a tutor! Visit your <a href="/tutor/dashboard" className="font-semibold underline">dashboard</a>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Become a Tutor</h1>
        <p className="text-gray-600 mb-8">
          Complete your tutor profile to start teaching and earning with Tutorix
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Display */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Picture</h3>
            <div className="mb-4 flex items-center gap-4">
              {previewImage ? (
                <div className="relative w-24 h-24">
                  <img
                    src={previewImage.startsWith("http") ? previewImage : `${process.env.NEXT_PUBLIC_API_BASE_URL}${previewImage}`}
                    alt="Profile Image Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <button
                        type="button"
                        onClick={() => handleDismissImage(onChange)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">No Image</span>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Update Image</label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                      accept=".jpg,.jpeg,.png,.webp"
                      className="text-sm"
                    />
                  )}
                />
                {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>}
              </div>
            </div>
          </div>

          {/* Tutor Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tutor Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  type="text"
                  className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                  {...register("subject")}
                  placeholder="Mathematics"
                />
                {errors.subject?.message && (
                  <p className="text-xs text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="gradeLevel">Grade Level *</label>
                <input
                  id="gradeLevel"
                  type="text"
                  className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                  {...register("gradeLevel")}
                  placeholder="10-12"
                />
                {errors.gradeLevel?.message && (
                  <p className="text-xs text-red-600">{errors.gradeLevel.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="pricePerHour">Price per Hour ($) *</label>
                <input
                  id="pricePerHour"
                  type="number"
                  step="0.01"
                  className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                  {...register("pricePerHour")}
                  placeholder="25"
                />
                {errors.pricePerHour?.message && (
                  <p className="text-xs text-red-600">{errors.pricePerHour.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="experienceYears">Experience (years) *</label>
                <input
                  id="experienceYears"
                  type="number"
                  className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                  {...register("experienceYears")}
                  placeholder="5"
                />
                {errors.experienceYears?.message && (
                  <p className="text-xs text-red-600">{errors.experienceYears.message}</p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="responseTime">Response Time *</label>
                <input
                  id="responseTime"
                  type="text"
                  className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                  {...register("responseTime")}
                  placeholder="Usually replies within 1 hour"
                />
                {errors.responseTime?.message && (
                  <p className="text-xs text-red-600">{errors.responseTime.message}</p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="languages">Languages (comma-separated) *</label>
                <input
                  id="languages"
                  type="text"
                  className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                  {...register("languages")}
                  placeholder="English, Spanish, French"
                />
                {errors.languages?.message && (
                  <p className="text-xs text-red-600">{errors.languages.message}</p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="tags">Tags (comma-separated)</label>
                <input
                  id="tags"
                  type="text"
                  className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                  {...register("tags")}
                  placeholder="certified, experienced, interactive"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="about">About *</label>
                <textarea
                  id="about"
                  className="h-20 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
                  {...register("about")}
                  placeholder="Write about your teaching style and experience..."
                />
                {errors.about?.message && (
                  <p className="text-xs text-red-600">{errors.about.message}</p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="education">Education (line-separated)</label>
                <textarea
                  id="education"
                  className="h-20 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
                  {...register("education")}
                  placeholder="Bachelor of Science in Mathematics&#10;Master of Education"
                />
              </div>
            </div>
          </div>

          {/* Availability Slots */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Availability</h3>
            
            <div className="space-y-4">
              {/* Add New Slot */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Add New Availability</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Select Date</label>
                    <input
                      type="date"
                      value={availabilityDate}
                      onChange={(e) => setAvailabilityDate(e.target.value)}
                      className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-foreground/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Select Time</label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={availabilityTime}
                        onChange={(e) => setAvailabilityTime(e.target.value)}
                        className="h-10 flex-1 rounded-md border border-black/10 px-3 text-sm outline-none focus:border-foreground/40"
                      />
                      <button
                        type="button"
                        onClick={addAvailabilityTime}
                        className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        Add Time
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Times */}
                {availabilityTimes.length > 0 && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-700 mb-2">Selected Times:</p>
                    <div className="flex flex-wrap gap-2">
                      {availabilityTimes.map((time, idx) => (
                        <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">
                          {time}
                          <button
                            type="button"
                            onClick={() => removeAvailabilityTime(idx)}
                            className="ml-1 text-green-800 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={addAvailabilitySlot}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add Date
                </button>
              </div>

              {/* Existing Slots */}
              {availabilitySlots.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Scheduled Availability:</p>
                  {availabilitySlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{slot.day}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {slot.times.map((time, tidx) => (
                            <span key={tidx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAvailabilitySlot(idx)}
                        className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || pending}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg disabled:opacity-60 font-medium"
            >
              {isSubmitting || pending ? "Processing..." : "Become a Tutor"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
