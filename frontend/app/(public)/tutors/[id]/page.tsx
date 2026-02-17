"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTutorById } from "@/lib/api/auth";
import Navbar from "../../_components/Navbar";
import DashboardNavbar from "../../_components/DashboardNavbar";
import Footer from "../../_components/Footer";
import { useAuth } from "@/context/AuthContext";

interface Tutor {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
  subject?: string;
  gradeLevel?: string;
  pricePerHour?: number;
  rating?: number;
  reviewsCount?: number;
  about?: string;
  experienceYears?: number;
  responseTime?: string;
  languages?: string[];
  tags?: string[];
  education?: string[];
  availabilitySlots?: { day: string; times: string[] }[];
  reviews?: { name: string; detail: string; quote: string }[];
}

const getProfileImageUrl = (profileImage?: string) => {
  if (!profileImage) return "";

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  if (profileImage.startsWith("http")) {
    return profileImage.replace("10.0.2.2", "localhost");
  }

  return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
};

export default function TutorDetailPage() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const tutorId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorId) {
      setTutor(null);
      setLoading(false);
      setError("Tutor not found.");
      return;
    }

    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTutorById(tutorId);
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch tutor");
        }
        setTutor(result.data || null);
      } catch (err: Error | any) {
        setError(err.message || "Failed to fetch tutor");
        setTutor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId]);

  if (loading || error || !tutor) {
    return (
      <div className="bg-linear-to-b from-emerald-50 via-sky-50 to-white min-h-screen">
        {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
        <section className="py-10">
          <div className="mx-auto max-w-6xl px-6 text-slate-500">
            {loading && "Loading tutor..."}
            {error && <span className="text-red-500">{error}</span>}
            {!loading && !error && !tutor && "Tutor not found."}
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const rating = tutor.rating !== undefined ? tutor.rating.toFixed(1) : "5.0";
  const reviewsCount = tutor.reviewsCount !== undefined ? tutor.reviewsCount : 128;
  const pricePerHour = tutor.pricePerHour !== undefined ? tutor.pricePerHour : 45;
  const subject = tutor.subject || "Expert Mathematics & Physics";
  const experienceLabel = tutor.experienceYears !== undefined
    ? `${tutor.experienceYears}+ Years`
    : "Not provided";
  const responseTime = tutor.responseTime || "Not provided";
  const languages = tutor.languages || [];
  const tags = tutor.tags || [];
  const education = tutor.education || [];
  const availabilitySlots = tutor.availabilitySlots || [];
  const reviews = tutor.reviews || [];

  return (
    <div className="bg-linear-to-b from-emerald-50 via-sky-50 to-white">
      {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          {/* <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-500">Home</Link>
            <span>/</span>
            <Link href="/tutors" className="hover:text-slate-500">Tutor Search</Link>
            <span>/</span>
            <span className="text-slate-500">{tutor.fullName}</span>
          </div> */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/90 p-6 shadow-sm border border-emerald-100">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative h-20 w-20">
                  <img
                    src={getProfileImageUrl(tutor.profileImage)}
                    alt={tutor.fullName}
                    className="h-20 w-20 rounded-full object-cover border border-emerald-100"
                  />
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold text-slate-900">{tutor.fullName}</h1>
                    <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-1 rounded-full">
                      VERIFIED PROFILE
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{subject}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
                      </svg>
                      {rating} ({reviewsCount} reviews)
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      {languages.length > 0 ? `Speaks ${languages.join(", ")}` : "Languages not provided"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Experience", value: experienceLabel },
                { label: "Hourly Fee", value: `$${pricePerHour} / hour` },
                { label: "Response Time", value: responseTime },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/90 p-5 border border-emerald-100 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white/90 p-6 border border-emerald-100 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">About Me</h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {tutor.about || "No bio provided yet."}
              </p>
            </div>

            <div className="rounded-2xl bg-white/90 p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
                <span className="text-xs text-slate-400">Oct 21 - Oct 27, 2023</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-7 text-xs">
                {availabilitySlots.length > 0 ? (
                  availabilitySlots.map((slot) => (
                    <div key={slot.day} className="rounded-xl bg-emerald-50/60 p-3 text-center">
                      <p className="text-slate-400 font-semibold">{slot.day}</p>
                      <div className="mt-2 space-y-2">
                        {slot.times.map((time) => (
                          <div
                            key={time}
                            className={
                              "rounded-lg px-2 py-1 " +
                              (time === "Booked" ? "bg-slate-200 text-slate-400" : "bg-sky-100 text-sky-700")
                            }
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No availability provided.</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/90 p-6 border border-emerald-100 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Recent Reviews</h2>
              <div className="mt-4 space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={`${review.name}-${review.detail}`} className="rounded-xl border border-slate-200 p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                          <p className="text-xs text-slate-400">{review.detail}</p>
                        </div>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <svg key={index} className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{review.quote}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No reviews yet.</div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-white/95 p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">${pricePerHour}</h3>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Money-back guarantee</span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Trial lesson (30 min)</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Selected: Oct 24, 09:00 AM</span>
                  <span className="text-slate-900 font-semibold">${pricePerHour}.00</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span>${pricePerHour}.00</span>
              </div>
              <button className="mt-5 w-full rounded-xl bg-sky-600 text-white py-3 text-sm font-semibold hover:bg-sky-700">
                Book Tutor
              </button>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <button className="rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-50">
                  Message
                </button>
                <button className="rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-50">
                  Save
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white/95 p-6 border border-emerald-100 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900">Quick Response</h4>
              <p className="mt-2 text-xs text-slate-500">Usually responds in under 1 hour.</p>
            </div>

            <div className="rounded-2xl bg-white/95 p-6 border border-emerald-100 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900">Education</h4>
              {education.length > 0 ? (
                <ul className="mt-3 space-y-3 text-sm text-slate-600">
                  {education.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Education not provided.</p>
              )}
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-xs text-slate-600 border border-emerald-100">
              Secure payments processed by Tutorix. Your satisfaction is our priority.
              Contact support if you need assistance.
            </div>
          </aside>
        </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
