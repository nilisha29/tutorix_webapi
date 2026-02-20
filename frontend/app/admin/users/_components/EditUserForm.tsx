"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserEditData, UserEditSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { useRouter } from "next/navigation";

type EditUserFormProps = {
  userId: string;
  initialData: any;
};

export default function EditUserForm({ userId, initialData }: EditUserFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserEditData>({
    resolver: zodResolver(UserEditSchema) as any,
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      username: initialData?.username || "",
      phoneNumber: initialData?.phoneNumber || "",
      address: initialData?.address || "",
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.profileImage) {
      setPreviewImage(initialData.profileImage);
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
      fileInputRef.current.value = '';
    }
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
        if (data.address) formData.append('address', data.address);
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
        if (data.image) {
          formData.append('profileImage', data.image);
        }
        if (initialData?.role) {
          formData.append('role', initialData.role);
        }

        const response = await handleUpdateUser(userId, formData);

        if (!response.success) {
          throw new Error(response.message || 'Update failed');
        }
        
        toast.success('User updated successfully');
        router.push(`/admin/users/${userId}`);

      } catch (error: Error | any) {
        toast.error(error.message || 'Update failed');
        setError(error.message || 'Update failed');
      }
    });
  };

  const isTutor = initialData?.role === "tutor";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Profile Image Display */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Picture</h3>
        <div className="mb-4 flex items-center gap-4">
          {previewImage ? (
            <div className="relative w-24 h-24">
              <img
                src={previewImage}
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
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="username"
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
              autoComplete="tel"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("phoneNumber")}
              placeholder="98XXXXXXXX"
            />
            {errors.phoneNumber?.message && (
              <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium" htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
              {...register("address")}
              placeholder="City, Street"
            />
            {errors.address?.message && (
              <p className="text-xs text-red-600">{errors.address.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tutor Information (if applicable) */}
      {isTutor && (
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
              {errors.subject?.message && (
                <p className="text-xs text-red-600">{errors.subject.message}</p>
              )}
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
              {errors.gradeLevel?.message && (
                <p className="text-xs text-red-600">{errors.gradeLevel.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="pricePerHour">Price per Hour ($)</label>
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
              <label className="text-sm font-medium" htmlFor="experienceYears">Experience (years)</label>
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
              {errors.rating?.message && (
                <p className="text-xs text-red-600">{errors.rating.message}</p>
              )}
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
              {errors.reviewsCount?.message && (
                <p className="text-xs text-red-600">{errors.reviewsCount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="responseTime">Response Time</label>
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

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="languages">Languages (comma-separated)</label>
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

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tags">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                {...register("tags")}
                placeholder="certified, experienced, interactive"
              />
              {errors.tags?.message && (
                <p className="text-xs text-red-600">{errors.tags.message}</p>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="about">About</label>
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
              {errors.education?.message && (
                <p className="text-xs text-red-600">{errors.education.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

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
          {isSubmitting || pending ? "Updating..." : "Update User"}
        </button>
        <Link href={`/admin/users/${userId}`} className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
          Cancel
        </Link>
      </div>
    </form>
  );
}
