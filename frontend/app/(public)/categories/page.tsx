// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import DashboardNavbar from "../_components/DashboardNavbar";
// import Footer from "../_components/Footer";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   subject?: string;
// }

// const subjectDescriptions: Record<string, string> = {
//   Mathematics: "Build strong fundamentals and solve problems confidently.",
//   Science: "Understand concepts in Physics, Chemistry, and Biology.",
//   English: "Improve writing, grammar, reading, and communication skills.",
//   Programming: "Learn coding with practical projects and guided practice.",
//   Music: "Develop rhythm, technique, and performance confidence.",
//   Languages: "Practice speaking and comprehension with expert tutors.",
// };

// const slugify = (value: string) =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");

// export default function CategoriesPage() {
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

//   const categories = useMemo(() => {
//     const subjectMap = new Map<string, number>();

//     for (const tutor of tutors) {
//       const normalizedSubject = tutor.subject?.trim();
//       if (!normalizedSubject) continue;
//       subjectMap.set(normalizedSubject, (subjectMap.get(normalizedSubject) ?? 0) + 1);
//     }

//     return Array.from(subjectMap.entries())
//       .map(([subject, count]) => ({
//         subject,
//         count,
//         description: subjectDescriptions[subject] || "Browse expert tutors and start your learning journey.",
//         slug: slugify(subject),
//       }))
//       .sort((left, right) => right.count - left.count || left.subject.localeCompare(right.subject));
//   }, [tutors]);

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <DashboardNavbar />
//       <section className="py-10">
//         <div className="mx-auto w-full max-w-6xl px-6">
//           <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
//           <p className="mt-2 text-sm text-slate-600">
//             Choose a subject to explore tutors, view profiles, and book sessions easily.
//           </p>

//           {loading && <p className="mt-8 text-blue-600">Loading categories...</p>}
//           {error && <p className="mt-8 text-red-500">{error}</p>}

//           {!loading && !error && categories.length === 0 && (
//             <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
//               No categories available yet.
//             </div>
//           )}

//           {!loading && !error && categories.length > 0 && (
//             <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {categories.map((category) => (
//                 <Link
//                   key={category.subject}
//                   href={`/categories/${category.slug}`}
//                   className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <h2 className="text-lg font-semibold text-slate-900">{category.subject}</h2>
//                     <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//                       {category.count} tutors
//                     </span>
//                   </div>
//                   <p className="mt-3 text-sm text-slate-600">{category.description}</p>
//                 </Link>
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
// import DashboardNavbar from "../_components/DashboardNavbar";
// import Footer from "../_components/Footer";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   subject?: string;
// }

// const subjectDescriptions: Record<string, string> = {
//   Mathematics: "Build strong fundamentals and solve problems confidently.",
//   Science: "Understand concepts in Physics, Chemistry, and Biology.",
//   English: "Improve writing, grammar, reading, and communication skills.",
//   Programming: "Learn coding with practical projects and guided practice.",
//   Music: "Develop rhythm, technique, and performance confidence.",
//   Languages: "Practice speaking and comprehension with expert tutors.",
// };

// const slugify = (value: string) =>
//   value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");

// export default function CategoriesPage() {
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

//   const categories = useMemo(() => {
//     const subjectMap = new Map<string, number>();
//     for (const tutor of tutors) {
//       const normalizedSubject = tutor.subject?.trim();
//       if (!normalizedSubject) continue;
//       subjectMap.set(normalizedSubject, (subjectMap.get(normalizedSubject) ?? 0) + 1);
//     }
//     return Array.from(subjectMap.entries())
//       .map(([subject, count]) => ({
//         subject,
//         count,
//         description: subjectDescriptions[subject] || "Browse expert tutors and start your learning journey.",
//         slug: slugify(subject),
//       }))
//       .sort((left, right) => right.count - left.count || left.subject.localeCompare(right.subject));
//   }, [tutors]);

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <DashboardNavbar />
//       <section className="py-12">
//         <div className="mx-auto max-w-7xl px-6 space-y-10">
//           <div className="text-center">
//             <h1 className="text-4xl font-bold text-slate-900">Categories</h1>
//             <p className="mt-2 text-sm text-slate-600">
//               Choose a subject to explore tutors, view profiles, and book sessions easily.
//             </p>
//           </div>

//           {loading && <p className="text-blue-600 text-center">Loading categories...</p>}
//           {error && <p className="text-red-500 text-center">{error}</p>}

//           {!loading && !error && categories.length === 0 && (
//             <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 text-center">
//               No categories available yet.
//             </div>
//           )}

//           {!loading && !error && categories.length > 0 && (
//             <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {categories.map((category) => (
//                 <Link
//                   key={category.subject}
//                   href={`/categories/${category.slug}`}
//                   className="rounded-3xl p-6 bg-gradient-to-tr from-blue-50 to-white border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//                 >
//                   <div className="flex items-center justify-between gap-4">
//                     <h2 className="text-lg font-semibold text-slate-900">{category.subject}</h2>
//                     <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//                       {category.count} tutors
//                     </span>
//                   </div>
//                   <p className="mt-3 text-sm text-slate-600">{category.description}</p>
//                 </Link>
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
import Footer from "../_components/Footer";
import { getTutors } from "@/lib/api/auth";

interface Tutor {
  _id: string;
  subject?: string;
}

const subjectDescriptions: Record<string, string> = {
  Mathematics: "Build strong fundamentals and solve problems confidently.",
  Science: "Understand concepts in Physics, Chemistry, and Biology.",
  English: "Improve writing, grammar, reading, and communication skills.",
  Programming: "Learn coding with practical projects and guided practice.",
  Music: "Develop rhythm, technique, and performance confidence.",
  Languages: "Practice speaking and comprehension with expert tutors.",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const cardColors = [
  "from-pink-50 to-pink-100",
  "from-blue-50 to-blue-100",
  "from-green-50 to-green-100",
  "from-yellow-50 to-yellow-100",
  "from-purple-50 to-purple-100",
  "from-orange-50 to-orange-100",
];

export default function CategoriesPage() {
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

  const categories = useMemo(() => {
    const subjectMap = new Map<string, number>();
    for (const tutor of tutors) {
      const normalizedSubject = tutor.subject?.trim();
      if (!normalizedSubject) continue;
      subjectMap.set(normalizedSubject, (subjectMap.get(normalizedSubject) ?? 0) + 1);
    }
    return Array.from(subjectMap.entries())
      .map(([subject, count], idx) => ({
        subject,
        count,
        description: subjectDescriptions[subject] || "Browse expert tutors and start your learning journey.",
        slug: slugify(subject),
        color: cardColors[idx % cardColors.length],
      }))
      .sort((left, right) => right.count - left.count || left.subject.localeCompare(right.subject));
  }, [tutors]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center space-y-6">
          <h1 className="text-4xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Choose a subject to explore tutors, view profiles, and book sessions easily.
          </p>

          {loading && <p className="text-blue-600">Loading categories...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {!loading && !error && categories.length > 0 && (
          <div className="mt-12 mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-6">
            {categories.map((category) => (
              <Link
                key={category.subject}
                href={`/categories/${category.slug}`}
                className={`rounded-3xl p-6 shadow-md bg-gradient-to-tr ${category.color} transform transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-slate-900">{category.subject}</h2>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700">
                    {category.count} tutors
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700">{category.description}</p>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="mt-12 text-center text-slate-500">No categories available yet.</div>
        )}
      </section>
    </div>
  );
}
