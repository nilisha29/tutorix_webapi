// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="  ">
//       Home
//     </div>
//   );
// }

"use client";

import Navbar from "./_components/Navbar";
import DashboardNavbar from "./_components/DashboardNavbar";
import HeroSection from "./_components/HeroSection";
import Footer from "./_components/Footer";
import { useAuth } from "@/context/AuthContext";

const categories = [
  "All Subjects",
  "Mathematics",
  "Science",
  "English",
  "Programming",
  "Music",
  "Languages",
];

const topTutors = [
  {
    name: "Dr. Sarah Jenkins",
    subject: "Mathematics & Statistics",
    rating: "4.9",
    reviews: "124",
    price: "$45",
  },
  {
    name: "Marcus Thorne",
    subject: "Physics & Mechanics",
    rating: "4.8",
    reviews: "98",
    price: "$38",
  },
  {
    name: "Elena Rodriguez",
    subject: "Spanish & Literature",
    rating: "5.0",
    reviews: "56",
    price: "$32",
  },
  {
    name: "James Wilson",
    subject: "Computer Science",
    rating: "4.9",
    reviews: "71",
    price: "$55",
  },
];

const recommended = [
  {
    name: "Linda Chen",
    subject: "Data Structures & Algorithms",
    mode: "Online • In-person",
    price: "$50",
    rating: "4.9",
  },
  {
    name: "David Miller",
    subject: "Classical Piano",
    mode: "In-person",
    price: "$40",
    rating: "5.0",
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

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
            {topTutors.map((tutor) => (
              <div
                key={tutor.name}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <div className="h-36 rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300" />
                  <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow">
                    ★ {tutor.rating} ({tutor.reviews})
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-900">{tutor.name}</h3>
                  <p className="text-xs text-slate-500">{tutor.subject}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{tutor.price}/hr</span>
                  <button className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    View Profile
                  </button>
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
            {recommended.map((tutor) => (
              <div
                key={tutor.name}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{tutor.name}</h3>
                    <p className="text-xs text-blue-600 font-medium">{tutor.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">{tutor.mode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-slate-900">{tutor.price}/hr</p>
                    <p className="text-xs text-slate-500">★ {tutor.rating}</p>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
