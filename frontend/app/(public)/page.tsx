// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="  ">
//       Home
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import Footer from "./_components/Footer";
import { getTutors } from "@/lib/api/auth";

const categories = [
  "All Subjects",
  "Mathematics",
  "Science",
  "English",
  "Programming",
  "Music",
  "Languages",
];

interface Tutor {
  _id: string;
  fullName: string;
  subject?: string;
  rating?: number;
  reviewsCount?: number;
  pricePerHour?: number;
  profileImage?: string;
}

export default function HomePage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const result = await getTutors();
        if (result?.success) {
          setTutors(result.data || []);
        }
      } catch {
        setTutors([]);
      }
    };

    fetchTutors();
  }, []);

  const topRatedTutors = useMemo(() => {
    return [...tutors]
      .sort((left, right) => {
        const leftRating = left.rating ?? 0;
        const rightRating = right.rating ?? 0;

        if (rightRating !== leftRating) {
          return rightRating - leftRating;
        }

        return (right.reviewsCount ?? 0) - (left.reviewsCount ?? 0);
      })
      .slice(0, 4);
  }, [tutors]);

  const recommendedTutors = useMemo(() => {
    return [...tutors]
      .sort((left, right) => {
        const leftReviews = left.reviewsCount ?? 0;
        const rightReviews = right.reviewsCount ?? 0;

        if (rightReviews !== leftReviews) {
          return rightReviews - leftReviews;
        }

        return (right.rating ?? 0) - (left.rating ?? 0);
      })
      .slice(0, 2);
  }, [tutors]);

  const getProfileImageUrl = (profileImage?: string) => {
    if (!profileImage) return "";

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

    if (profileImage.startsWith("http")) {
      return profileImage.replace("10.0.2.2", "localhost");
    }

    return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
  };

  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection />

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                className={
                  index === 0
                    ? "px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold"
                    : "px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Top Rated Tutors</h2>
              <p className="text-sm text-slate-500">Carefully selected based on learner success.</p>
            </div>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">See all</a>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topRatedTutors.map((tutor) => (
              <div
                key={tutor._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <div className="h-36 rounded-xl bg-linear-to-br from-slate-200 via-slate-100 to-slate-300 overflow-hidden">
                    {tutor.profileImage ? (
                      <img
                        src={getProfileImageUrl(tutor.profileImage)}
                        alt={tutor.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow">
                    ★ {(tutor.rating ?? 0).toFixed(1)} ({tutor.reviewsCount ?? 0})
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-900">{tutor.fullName}</h3>
                  <p className="text-xs text-slate-500">{tutor.subject || "Tutor"}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">${tutor.pricePerHour ?? 0}/hr</span>
                  <Link
                    href={`/tutors/${tutor._id}`}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-slate-900">Recommended for You</h2>
          <p className="text-sm text-slate-500">Based on your interests and popular choices.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {recommendedTutors.map((tutor) => (
              <div
                key={tutor._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {tutor.profileImage ? (
                      <img
                        src={getProfileImageUrl(tutor.profileImage)}
                        alt={tutor.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                        {tutor.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{tutor.fullName}</h3>
                      <p className="text-xs text-blue-600 font-medium">{tutor.subject || "Tutor"}</p>
                      <p className="text-xs text-slate-500 mt-1">Inperson</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-slate-900">${tutor.pricePerHour ?? 0}/hr</p>
                    <p className="text-xs text-slate-500">★ {(tutor.rating ?? 0).toFixed(1)} ({tutor.reviewsCount ?? 0})</p>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-full bg-slate-900 text-white text-xs font-semibold py-2.5 hover:bg-slate-800">
                  Book Trial Lesson
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="px-6 py-3 rounded-full border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50">
              Explore All 1,500+ Tutors
            </button>
          </div>

          
      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            How Tutorix Works
          </h2>
          <p className="mt-3 text-slate-500">
            Start learning in just 3 simple steps
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Search Tutor",
                desc: "Browse subjects and find your ideal tutor."
              },
              {
                step: "2",
                title: "Book & Pay",
                desc: "Secure payment via eSewa or Khalti."
              },
              {
                step: "3",
                title: "Start Learning",
                desc: "Join your session and improve your skills."
              }
            ].map((item) => (
              <div
                key={item.step}
                className="p-8 bg-slate-50 rounded-2xl border hover:shadow-md transition"
              >
                <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 font-bold rounded-full flex items-center justify-center text-lg">
                  {item.step}
                </div>
                <h3 className="mt-6 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Why Choose Tutorix?
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-10">
            <div>
              <div className="text-indigo-600 text-4xl mb-4">✔</div>
              <h3 className="font-semibold text-slate-900">
                Verified Tutors
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                All tutors are carefully reviewed and verified.
              </p>
            </div>

            <div>
              <div className="text-indigo-600 text-4xl mb-4">💳</div>
              <h3 className="font-semibold text-slate-900">
                Secure Payment
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Safe and reliable transactions.
              </p>
            </div>

            <div>
              <div className="text-indigo-600 text-4xl mb-4">🌍</div>
              <h3 className="font-semibold text-slate-900">
                Learn Anywhere
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Online and offline learning options.
              </p>
            </div>
          </div>
        </div>
      </section>
      
        </div>
      </section>

      <Footer />
    </div>
  );
}
