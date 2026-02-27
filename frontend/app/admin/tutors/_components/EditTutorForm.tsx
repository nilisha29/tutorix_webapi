"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserEditData, UserEditSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { useRouter } from "next/navigation";

type EditTutorFormProps = {
  tutorId: string;
  initialData: any;
};

export default function EditTutorForm({ tutorId, initialData }: EditTutorFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserEditData>({
    resolver: zodResolver(UserEditSchema) as any,
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      username: initialData?.username || "",
      phoneNumber: initialData?.phoneNumber || "",
      subject: initialData?.subject || "",
      gradeLevel: initialData?.gradeLevel || "",
      pricePerHour: initialData?.pricePerHour || "",
      rating: initialData?.rating || "",
      reviewsCount: initialData?.reviewsCount || "",
      about: initialData?.about || "",
      experienceYears: initialData?.experienceYears || "",
      responseTime: initialData?.responseTime || "",
      languages: Array.isArray(initialData?.languages) ? initialData.languages.join(", ") : (initialData?.languages || ""),
      tags: Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : (initialData?.tags || ""),
      education: Array.isArray(initialData?.education) ? initialData.education.join("\n") : (initialData?.education || ""),
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
    if (initialData?.profileImage) {
      setPreviewImage(initialData.profileImage);
    }
    // Pre-populate availability slots
    if (initialData?.availabilitySlots && Array.isArray(initialData.availabilitySlots)) {
      setAvailabilitySlots(initialData.availabilitySlots);
    }
  }, [initialData]);

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
        
        if (data.fullName) formData.append('fullName', data.fullName);
        if (data.email) formData.append('email', data.email);
        if (data.username) formData.append('username', data.username);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        if (data.subject) formData.append('subject', data.subject);
        if (data.gradeLevel) formData.append('gradeLevel', data.gradeLevel);
        if (data.pricePerHour) formData.append('pricePerHour', String(data.pricePerHour));
        if (data.rating) formData.append('rating', String(data.rating));
        if (data.reviewsCount) formData.append('reviewsCount', String(data.reviewsCount));
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
        if (initialData?.role) {
          formData.append('role', initialData.role);
        }

        const response = await handleUpdateUser(tutorId, formData);

        if (!response.success) {
          throw new Error(response.message || 'Update failed');
        }
        
        toast.success('Tutor updated successfully');
        router.push(`/admin/tutors/${tutorId}`);

      } catch (error: Error | any) {
        toast.error(error.message || 'Update failed');
        setError(error.message || 'Update failed');
      }
    });
  };

  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("fullName")}
              placeholder="Jane Doe"
            />
            {errors.fullName?.message && (
              <p className="text-xs text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("email")}
              placeholder="you@example.com"
            />
            {errors.email?.message && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("username")}
              placeholder="username"
            />
            {errors.username?.message && (
              <p className="text-xs text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="phoneNumber">Phone number</label>
            <input
              id="phoneNumber"
              type="text"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("phoneNumber")}
              placeholder="98XXXXXXXX"
            />
            {errors.phoneNumber?.message && (
              <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tutor Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tutor Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("subject")}
              placeholder="Mathematics"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="gradeLevel">Grade Level</label>
            <input
              id="gradeLevel"
              type="text"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("gradeLevel")}
              placeholder="10-12"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="pricePerHour">Price per Hour (Rs)</label>
            <input
              id="pricePerHour"
              type="number"
              step="0.01"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("pricePerHour")}
              placeholder="25"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="experienceYears">Experience (years)</label>
            <input
              id="experienceYears"
              type="number"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("experienceYears")}
              placeholder="5"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="rating">Rating (0-5)</label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("rating")}
              placeholder="4.5"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="reviewsCount">Reviews Count</label>
            <input
              id="reviewsCount"
              type="number"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("reviewsCount")}
              placeholder="0"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium" htmlFor="responseTime">Response Time</label>
            <input
              id="responseTime"
              type="text"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("responseTime")}
              placeholder="Usually replies within 1 hour"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium" htmlFor="languages">Languages (comma-separated)</label>
            <input
              id="languages"
              type="text"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("languages")}
              placeholder="English, Spanish, French"
            />
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
            <label className="text-sm font-medium" htmlFor="about">About</label>
            <textarea
              id="about"
              className="h-20 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
              {...register("about")}
              placeholder="Write about your teaching style and experience..."
            />
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg disabled:opacity-60 font-medium"
        >
          {isSubmitting || pending ? "Updating..." : "Update Tutor"}
        </button>
        <Link href={`/admin/tutors/${tutorId}`} className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
          Cancel
        </Link>
      </div>
    </form>
  );
}
