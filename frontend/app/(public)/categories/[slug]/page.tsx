// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import DashboardNavbar from "../../_components/DashboardNavbar";
// import Footer from "../../_components/Footer";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   fullName: string;
//   subject?: string;
//   profileImage?: string;
//   pricePerHour?: number;
//   rating?: number;
//   reviewsCount?: number;
// }

// const slugify = (value: string) =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");

// const getProfileImageUrl = (profileImage?: string) => {
//   if (!profileImage) return "";

//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

//   if (profileImage.startsWith("http")) {
//     return profileImage.replace("10.0.2.2", "localhost");
//   }

//   return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
// };

// export default function CategoryTutorsPage() {
//   const params = useParams<{ slug: string }>();
//   const slug = params?.slug || "";

//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await getTutors();
//         if (!result.success) {
//           throw new Error(result.message || "Failed to fetch tutors");
//         }
//         setTutors(result.data || []);
//       } catch (err: Error | any) {
//         setError(err.message || "Failed to fetch tutors");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTutors();
//   }, []);

//   const categoryTutors = useMemo(() => {
//     return tutors
//       .filter((tutor) => tutor.subject && slugify(tutor.subject) === slug)
//       .sort((left, right) => (right.rating ?? 0) - (left.rating ?? 0));
//   }, [slug, tutors]);

//   const categoryLabel = useMemo(() => {
//     const matchedSubject = tutors.find((tutor) => tutor.subject && slugify(tutor.subject) === slug)?.subject;
//     if (matchedSubject) return matchedSubject;
//     return slug
//       .split("-")
//       .filter(Boolean)
//       .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
//       .join(" ");
//   }, [slug, tutors]);

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <DashboardNavbar />
//       <section className="py-10">
//         <div className="mx-auto w-full max-w-6xl px-6">
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Category</p>
//               <h1 className="mt-2 text-3xl font-bold text-slate-900">{categoryLabel || "Tutors"}</h1>
//               <p className="mt-2 text-sm text-slate-600">View tutors, check profiles, and book sessions quickly.</p>
//             </div>
//             <Link
//               href="/categories"
//               className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               All Categories
//             </Link>
//           </div>

//           {loading && <p className="mt-8 text-blue-600">Loading tutors...</p>}
//           {error && <p className="mt-8 text-red-500">{error}</p>}

//           {!loading && !error && categoryTutors.length === 0 && (
//             <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
//               No tutors found in this category.
//             </div>
//           )}

//           {!loading && !error && categoryTutors.length > 0 && (
//             <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {categoryTutors.map((tutor) => (
//                 <div key={tutor._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                   <div className="flex items-center gap-3">
//                     {tutor.profileImage ? (
//                       <img
//                         src={getProfileImageUrl(tutor.profileImage)}
//                         alt={tutor.fullName}
//                         className="h-12 w-12 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
//                         {tutor.fullName.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                     <div>
//                       <h2 className="text-base font-semibold text-slate-900">{tutor.fullName}</h2>
//                       <p className="text-xs text-slate-500">{tutor.subject || "Tutor"}</p>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex items-center justify-between text-sm">
//                     <span className="font-semibold text-slate-900">${tutor.pricePerHour ?? 0}/hr</span>
//                     <span className="text-slate-600">★ {(tutor.rating ?? 0).toFixed(1)} ({tutor.reviewsCount ?? 0})</span>
//                   </div>

//                   <div className="mt-5 flex gap-2">
//                     <Link
//                       href={`/tutors/${tutor._id}`}
//                       className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                       View Details
//                     </Link>
//                     <Link
//                       href={`/tutors/${tutor._id}`}
//                       className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
//                     >
//                       Book Session
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import DashboardNavbar from "../../_components/DashboardNavbar";
// import Footer from "../../_components/Footer";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   fullName: string;
//   subject?: string;
//   profileImage?: string;
//   pricePerHour?: number;
//   rating?: number;
//   reviewsCount?: number;
// }

// const slugify = (value: string) =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");

// const getProfileImageUrl = (profileImage?: string) => {
//   if (!profileImage) return "";
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
//   if (profileImage.startsWith("http")) return profileImage.replace("10.0.2.2", "localhost");
//   return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
// };

// export default function CategoryTutorsPage() {
//   const params = useParams<{ slug: string }>();
//   const slug = params?.slug || "";

//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await getTutors();
//         if (!result.success) throw new Error(result.message || "Failed to fetch tutors");
//         setTutors(result.data || []);
//       } catch (err: Error | any) {
//         setError(err.message || "Failed to fetch tutors");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTutors();
//   }, []);

//   const categoryTutors = useMemo(
//     () => tutors.filter((tutor) => tutor.subject && slugify(tutor.subject) === slug).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
//     [slug, tutors]
//   );

//   const categoryLabel = useMemo(() => {
//     const matchedSubject = tutors.find((tutor) => tutor.subject && slugify(tutor.subject) === slug)?.subject;
//     if (matchedSubject) return matchedSubject;
//     return slug
//       .split("-")
//       .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//       .join(" ");
//   }, [slug, tutors]);

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <DashboardNavbar />
//       <section className="py-12">
//         <div className="mx-auto max-w-7xl px-6 space-y-10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div>
//               <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Category</p>
//               <h1 className="mt-2 text-4xl font-bold text-slate-900">{categoryLabel || "Tutors"}</h1>
//               <p className="mt-2 text-sm text-slate-600">View tutors, check profiles, and book sessions quickly.</p>
//             </div>
//             <Link
//               href="/categories"
//               className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               All Categories
//             </Link>
//           </div>

//           {loading && <p className="text-blue-600 text-center">Loading tutors...</p>}
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           {!loading && !error && categoryTutors.length === 0 && (
//             <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 text-center">
//               No tutors found in this category.
//             </div>
//           )}

//           {!loading && !error && categoryTutors.length > 0 && (
//             <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {categoryTutors.map((tutor) => (
//                 <div
//                   key={tutor._id}
//                   className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
//                 >
//                   <div className="flex items-center gap-3">
//                     {tutor.profileImage ? (
//                       <img
//                         src={getProfileImageUrl(tutor.profileImage)}
//                         alt={tutor.fullName}
//                         className="h-12 w-12 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
//                         {tutor.fullName.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                     <div>
//                       <h2 className="text-base font-semibold text-slate-900">{tutor.fullName}</h2>
//                       <p className="text-xs text-slate-500">{tutor.subject || "Tutor"}</p>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex items-center justify-between text-sm">
//                     <span className="font-semibold text-slate-900">${tutor.pricePerHour ?? 0}/hr</span>
//                     <span className="text-slate-600">★ {(tutor.rating ?? 0).toFixed(1)} ({tutor.reviewsCount ?? 0})</span>
//                   </div>

//                   <div className="mt-5 flex gap-2">
//                     <Link
//                       href={`/tutors/${tutor._id}`}
//                       className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                       View Details
//                     </Link>
//                     <Link
//                       href={`/tutors/${tutor._id}`}
//                       className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
//                     >
//                       Book Session
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "../../_components/Footer";
import { getTutors } from "@/lib/api/auth";

interface Tutor {
  _id: string;
  fullName: string;
  subject?: string;
  profileImage?: string;
  pricePerHour?: number;
  rating?: number;
  reviewsCount?: number;
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const getProfileImageUrl = (profileImage?: string) => {
  if (!profileImage) return "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  if (profileImage.startsWith("http")) return profileImage.replace("10.0.2.2", "localhost");
  return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
};

const cardColors = ["from-pink-50 to-pink-100", "from-blue-50 to-blue-100", "from-green-50 to-green-100"];

export default function CategoryTutorsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTutors();
        if (!result.success) throw new Error(result.message || "Failed to fetch tutors");
        setTutors(result.data || []);
      } catch (err: Error | any) {
        setError(err.message || "Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const categoryTutors = useMemo(
    () => tutors.filter((tutor) => tutor.subject && slugify(tutor.subject) === slug).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [slug, tutors]
  );

  const categoryLabel = useMemo(() => {
    const matchedSubject = tutors.find((tutor) => tutor.subject && slugify(tutor.subject) === slug)?.subject;
    if (matchedSubject) return matchedSubject;
    return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }, [slug, tutors]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 space-y-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Category</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">{categoryLabel || "Tutors"}</h1>
              <p className="mt-2 text-sm text-slate-600">View tutors, check profiles, and book sessions quickly.</p>
            </div>
            <Link
              href="/categories"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              All Categories
            </Link>
          </div>

          {loading && <p className="text-blue-600 text-center">Loading tutors...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && !error && categoryTutors.length === 0 && (
            <div className="mt-12 text-center text-slate-500">No tutors found in this category.</div>
          )}

          {!loading && !error && categoryTutors.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTutors.map((tutor, idx) => (
                <div
                  key={tutor._id}
                  className={`rounded-3xl p-5 shadow-md transform transition hover:-translate-y-1 hover:shadow-lg bg-gradient-to-tr ${cardColors[idx % cardColors.length]}`}
                >
                  <div className="flex items-center gap-3">
                    {tutor.profileImage ? (
                      <img
                        src={getProfileImageUrl(tutor.profileImage)}
                        alt={tutor.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                        {tutor.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">{tutor.fullName}</h2>
                      <p className="text-xs text-slate-500">{tutor.subject || "Tutor"}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">${tutor.pricePerHour ?? 0}/hr</span>
                    <span className="text-slate-600">★ {(tutor.rating ?? 0).toFixed(1)} ({tutor.reviewsCount ?? 0})</span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/tutors/${tutor._id}`}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/tutors/${tutor._id}`}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Book Session
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}