"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

export default function CreateTutorForm() {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserData>({
    resolver: zodResolver(UserSchema) as any
  });
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityTime, setAvailabilityTime] = useState("");
  const [availabilityTimes, setAvailabilityTimes] = useState<string[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<{ day: string; times: string[] }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      throw new Error("Time is required");
    }
    setAvailabilityTimes((prev) => [...prev, availabilityTime]);
    setAvailabilityTime("");
  };

  const removeAvailabilityTime = (index: number) => {
    setAvailabilityTimes((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const addAvailabilitySlot = () => {
    if (!availabilityDate.trim()) {
      throw new Error("Availability date is required");
    }
    if (availabilityTimes.length === 0) {
      throw new Error("Availability times are required");
    }
    setAvailabilitySlots((prev) => [...prev, { day: availabilityDate, times: availabilityTimes }]);
    setAvailabilityDate("");
    setAvailabilityTimes([]);
  };

  const removeAvailabilitySlot = (index: number) => {
    setAvailabilitySlots((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const onSubmit: SubmitHandler<UserData> = async (data) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("username", data.username);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);
        formData.append("role", "tutor");

        if (data.phoneNumber) {
          formData.append("phoneNumber", data.phoneNumber);
        }
        if (data.address) {
          formData.append("address", data.address);
        }
        if (data.subject) {
          formData.append("subject", data.subject);
        }
        if (data.gradeLevel) {
          formData.append("gradeLevel", data.gradeLevel);
        }
        if (data.about) {
          formData.append("about", data.about);
        }
        if (data.experienceYears !== undefined) {
          formData.append("experienceYears", String(data.experienceYears));
        }
        if (data.responseTime) {
          formData.append("responseTime", data.responseTime);
        }
        if (data.languages) {
          const languages = Array.isArray(data.languages) ? data.languages.join(", ") : data.languages;
          formData.append("languages", languages);
        }
        if (data.tags) {
          const tags = Array.isArray(data.tags) ? data.tags.join(", ") : data.tags;
          formData.append("tags", tags);
        }
        if (data.education) {
          const education = Array.isArray(data.education) ? data.education.join("\n") : data.education;
          formData.append("education", education);
        }
        if (availabilitySlots.length > 0) {
          formData.append("availabilitySlots", JSON.stringify(availabilitySlots));
        }
        if (data.pricePerHour !== undefined) {
          formData.append("pricePerHour", String(data.pricePerHour));
        }
        if (data.rating !== undefined) {
          formData.append("rating", String(data.rating));
        }
        if (data.reviewsCount !== undefined) {
          formData.append("reviewsCount", String(data.reviewsCount));
        }
        if (data.image) {
          formData.append("profileImage", data.image);
        }

        const response = await handleCreateUser(formData);
        if (!response.success) {
          throw new Error(response.message || "Create tutor failed");
        }
        reset();
        handleDismissImage();
        toast.success("Tutor created successfully");
      } catch (err: Error | any) {
        toast.error(err.message || "Create tutor failed");
        setError(err.message || "Create tutor failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mb-4">
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
                  x
                </button>
              )}
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Profile Image</label>
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
              accept=".jpg,.jpeg,.png,.webp"
            />
          )}
        />
        {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
      </div>

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
          placeholder="Jane Doe"
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

      <div className="space-y-1">
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

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("subject")}
          placeholder="Math & Physics"
        />
        {errors.subject?.message && (
          <p className="text-xs text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="gradeLevel">Grade level</label>
        <input
          id="gradeLevel"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("gradeLevel")}
          placeholder="High School"
        />
        {errors.gradeLevel?.message && (
          <p className="text-xs text-red-600">{errors.gradeLevel.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="about">About</label>
        <textarea
          id="about"
          className="min-h-[110px] w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          {...register("about")}
          placeholder="Short bio about the tutor"
        />
        {errors.about?.message && (
          <p className="text-xs text-red-600">{errors.about.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="experienceYears">Experience (years)</label>
          <input
            id="experienceYears"
            type="number"
            min="0"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("experienceYears")}
            placeholder="10"
          />
          {errors.experienceYears?.message && (
            <p className="text-xs text-red-600">{errors.experienceYears.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="responseTime">Response time</label>
          <input
            id="responseTime"
            type="text"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("responseTime")}
            placeholder="< 1 Hour"
          />
          {errors.responseTime?.message && (
            <p className="text-xs text-red-600">{errors.responseTime.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="languages">Languages (comma separated)</label>
          <input
            id="languages"
            type="text"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("languages")}
            placeholder="English, Spanish"
          />
          {errors.languages?.message && (
            <p className="text-xs text-red-600">{errors.languages.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="tags">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("tags")}
            placeholder="SAT Prep, AP Physics"
          />
          {errors.tags?.message && (
            <p className="text-xs text-red-600">{errors.tags.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="education">Education (one per line)</label>
        <textarea
          id="education"
          className="min-h-[110px] w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          {...register("education")}
          placeholder="PhD in Applied Physics - Stanford University\nMSc in Mathematics - MIT"
        />
        {errors.education?.message && (
          <p className="text-xs text-red-600">{errors.education.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Availability</label>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="date"
            value={availabilityDate}
            onChange={(event) => setAvailabilityDate(event.target.value)}
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          />
          <input
            type="time"
            value={availabilityTime}
            onChange={(event) => setAvailabilityTime(event.target.value)}
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          />
          <button
            type="button"
            onClick={() => {
              try {
                addAvailabilityTime();
                setError(null);
              } catch (err: Error | any) {
                setError(err.message || "Invalid availability");
              }
            }}
            className="h-10 rounded-md bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
          >
            Add Time
          </button>
        </div>
        {availabilityTimes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availabilityTimes.map((time, index) => (
              <button
                key={`${time}-${index}`}
                type="button"
                onClick={() => removeAvailabilityTime(index)}
                className="rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
              >
                {time} x
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Add at least one time.</p>
        )}
        <button
          type="button"
          onClick={() => {
            try {
              addAvailabilitySlot();
              setError(null);
            } catch (err: Error | any) {
              setError(err.message || "Invalid availability");
            }
          }}
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Add Date
        </button>
        {availabilitySlots.length > 0 ? (
          <div className="space-y-2">
            {availabilitySlots.map((slot, index) => (
              <div key={`${slot.day}-${index}`} className="flex items-center justify-between rounded-md border border-black/10 dark:border-white/15 px-3 py-2 text-sm">
                <span>{slot.day} - {slot.times.join(", ")}</span>
                <button
                  type="button"
                  onClick={() => removeAvailabilitySlot(index)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No availability added yet.</p>
        )}
      </div>


      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="pricePerHour">Price per hour</label>
          <input
            id="pricePerHour"
            type="number"
            min="0"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("pricePerHour")}
            placeholder="40"
          />
          {errors.pricePerHour?.message && (
            <p className="text-xs text-red-600">{errors.pricePerHour.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="rating">Rating</label>
          <input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("rating")}
            placeholder="4.9"
          />
          {errors.rating?.message && (
            <p className="text-xs text-red-600">{errors.rating.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="reviewsCount">Reviews</label>
          <input
            id="reviewsCount"
            type="number"
            min="0"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("reviewsCount")}
            placeholder="82"
          />
          {errors.reviewsCount?.message && (
            <p className="text-xs text-red-600">{errors.reviewsCount.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("password")}
          placeholder="••••••"
        />
        {errors.password?.message && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("confirmPassword")}
          placeholder="••••••"
        />
        {errors.confirmPassword?.message && (
          <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating tutor..." : "Create tutor"}
      </button>
    </form>
  );
}
