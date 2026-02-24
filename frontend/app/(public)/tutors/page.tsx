

// "use client";

// import DashboardNavbar from "../_components/DashboardNavbar";



// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   fullName: string;
//   email: string;
//   username: string;
//   profileImage?: string;
//   subject?: string;
//   gradeLevel?: string;
//   pricePerHour?: number;
//   rating?: number;
//   reviewsCount?: number;
// }

// const filterChips = ["All", "Subject", "Grade Level", "Price", "Ratings"];

// const tutorMeta = [
//   { subject: "Math & Physics", rating: "4.9", reviews: "82" },
//   { subject: "English & History", rating: "4.8", reviews: "65" },
//   { subject: "Biology & Chemistry", rating: "4.9", reviews: "91" },
//   { subject: "SAT/ACT Prep", rating: "5.0", reviews: "120" },
// ];

// const getProfileImageUrl = (profileImage?: string) => {
//   if (!profileImage) return "";

//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

//   if (profileImage.startsWith("http")) {
//     return profileImage.replace("10.0.2.2", "localhost");
//   }

//   return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
// };

// export default function TutorsPage() {
//   const router = useRouter();
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

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

//   const filteredTutors = useMemo(() => {
//     if (!search.trim()) return tutors;
//     const term = search.toLowerCase();
//     return tutors.filter((tutor) =>
//       tutor.fullName.toLowerCase().includes(term) ||
//       tutor.username.toLowerCase().includes(term)
//     );
//   }, [search, tutors]);

//   return (
//     <div className="bg-slate-50">
//       <DashboardNavbar />
//       <section className="py-8">
//         <div className="mx-auto w-full max-w-6xl px-6">
//         <div className="flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="h-10 w-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-100"
//             aria-label="Go back"
//           >
//             <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Tutors</h1>

//           <button
//             type="button"
//             className="h-10 w-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-100"
//             aria-label="Filters"
//           >
//             <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
//             </svg>
//           </button>
//         </div>

//         <div className="mt-6 rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm flex items-center gap-3">
//           <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.3-4.3" />
//           </svg>
//           <input
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search by name or keyword..."
//             className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
//           />
//         </div>

//         <div className="mt-5 flex flex-wrap gap-3">
//           {filterChips.map((chip, index) => (
//             <button
//               key={chip}
//               className={
//                 index === 0
//                   ? "px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold"
//                   : "px-4 py-2 rounded-full bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-slate-100"
//               }
//             >
//               <span className="flex items-center gap-2">
//                 {chip}
//                 {index !== 0 && (
//                   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
//                   </svg>
//                 )}
//               </span>
//             </button>
//           ))}
//         </div>

//         {loading && (
//           <div className="mt-10 text-center text-slate-500">Loading tutors...</div>
//         )}

//         {error && (
//           <div className="mt-10 text-center text-red-500">{error}</div>
//         )}

//         {!loading && !error && filteredTutors.length === 0 && (
//           <div className="mt-10 text-center text-slate-500">No tutors available yet.</div>
//         )}

//         {!loading && !error && filteredTutors.length > 0 && (
//           <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {filteredTutors.map((tutor, index) => {
//               const meta = tutorMeta[index % tutorMeta.length];
//               const subject = tutor.subject || meta.subject;
//               const rating = tutor.rating !== undefined ? tutor.rating.toFixed(1) : meta.rating;
//               const reviews = tutor.reviewsCount !== undefined ? String(tutor.reviewsCount) : meta.reviews;
//               return (
//                 <div
//                   key={tutor._id}
//                   className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm"
//                 >
//                   <div className="rounded-2xl bg-slate-100 h-44 overflow-hidden flex items-center justify-center">
//                     {tutor.profileImage ? (
//                       <img
//                         src={getProfileImageUrl(tutor.profileImage)}
//                         alt={tutor.fullName}
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold">
//                         {tutor.fullName.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                   </div>
//                   <div className="mt-4">
//                     <h3 className="text-lg font-semibold text-slate-900">{tutor.fullName}</h3>
//                     <p className="text-sm text-slate-500">{subject}</p>
//                     <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
//                       <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
//                       </svg>
//                       <span className="font-semibold">{rating}</span>
//                       <span className="text-slate-400">({reviews})</span>
//                     </div>
//                     {tutor.pricePerHour !== undefined && (
//                       <p className="mt-2 text-sm font-semibold text-slate-900">${tutor.pricePerHour}/hr</p>
//                     )}
//                   </div>
//                   <Link
//                     href={`/tutors/${tutor._id}`}
//                     className="mt-4 w-full rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 inline-flex items-center justify-center"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//         </div>
//       </section>
//     </div>
//   );
// }




// "use client";

// import DashboardNavbar from "../_components/DashboardNavbar";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   fullName: string;
//   email: string;
//   username: string;
//   profileImage?: string;
//   subject?: string;
//   gradeLevel?: string;
//   pricePerHour?: number;
//   rating?: number;
//   reviewsCount?: number;
// }

// const filterChips = ["All", "Subject", "Grade Level", "Price", "Ratings"];

// const tutorMeta = [
//   { subject: "Math & Physics", rating: "4.9", reviews: "82" },
//   { subject: "English & History", rating: "4.8", reviews: "65" },
//   { subject: "Biology & Chemistry", rating: "4.9", reviews: "91" },
//   { subject: "SAT/ACT Prep", rating: "5.0", reviews: "120" },
// ];

// const getProfileImageUrl = (profileImage?: string) => {
//   if (!profileImage) return "";

//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

//   if (profileImage.startsWith("http")) {
//     return profileImage.replace("10.0.2.2", "localhost");
//   }

//   return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
// };

// export default function TutorsPage() {
//   const router = useRouter();
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

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

//   const filteredTutors = useMemo(() => {
//     if (!search.trim()) return tutors;
//     const term = search.toLowerCase();
//     return tutors.filter((tutor) =>
//       tutor.fullName.toLowerCase().includes(term) ||
//       tutor.username.toLowerCase().includes(term)
//     );
//   }, [search, tutors]);

//   return (
//     // <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
//       <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      
//       <DashboardNavbar />
//       <section className="py-10">
//         <div className="mx-auto w-full max-w-6xl px-6">

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="h-11 w-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-indigo-50 transition"
//             aria-label="Go back"
//           >
//             <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
//             Explore Tutors
//           </h1>

//           <button
//             type="button"
//             className="h-11 w-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-indigo-50 transition"
//             aria-label="Filters"
//           >
//             <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
//             </svg>
//           </button>
//         </div>

//         {/* Search */}
//         <div className="mt-8 rounded-2xl bg-white/70 backdrop-blur-md border border-indigo-100 px-5 py-4 shadow-md flex items-center gap-3">
//           <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.3-4.3" />
//           </svg>
//           <input
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search by name or keyword..."
//             className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
//           />
//         </div>

//         {/* Filters */}
//         <div className="mt-6 flex flex-wrap gap-3">
//           {filterChips.map((chip, index) => (
//             <button
//               key={chip}
//               className={
//                 index === 0
//                   ? "px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold shadow-md"
//                   : "px-5 py-2 rounded-full bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-indigo-50 transition"
//               }
//             >
//               <span className="flex items-center gap-2">
//                 {chip}
//                 {index !== 0 && (
//                   <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
//                   </svg>
//                 )}
//               </span>
//             </button>
//           ))}
//         </div>

//         {loading && (
//           <div className="mt-12 text-center text-indigo-500 font-medium">Loading tutors...</div>
//         )}

//         {error && (
//           <div className="mt-12 text-center text-red-500 font-medium">{error}</div>
//         )}

//         {!loading && !error && filteredTutors.length === 0 && (
//           <div className="mt-12 text-center text-slate-500">No tutors available yet.</div>
//         )}

//         {!loading && !error && filteredTutors.length > 0 && (
//           <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {filteredTutors.map((tutor, index) => {
//               const meta = tutorMeta[index % tutorMeta.length];
//               const subject = tutor.subject || meta.subject;
//               const rating = tutor.rating !== undefined ? tutor.rating.toFixed(1) : meta.rating;
//               const reviews = tutor.reviewsCount !== undefined ? String(tutor.reviewsCount) : meta.reviews;

//               return (
//                 <div
//                   key={tutor._id}
//                   className="group rounded-3xl bg-white/80 backdrop-blur-md border border-indigo-100 p-5 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
//                 >
//                   <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 h-44 overflow-hidden flex items-center justify-center">
//                     {tutor.profileImage ? (
//                       <img
//                         src={getProfileImageUrl(tutor.profileImage)}
//                         alt={tutor.fullName}
//                         className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
//                       />
//                     ) : (
//                       <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
//                         {tutor.fullName.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-5">
//                     <h3 className="text-lg font-bold text-slate-800">{tutor.fullName}</h3>
//                     <p className="text-sm text-indigo-600 font-medium">{subject}</p>

//                     <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
//                       <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
//                       </svg>
//                       <span className="font-semibold">{rating}</span>
//                       <span className="text-slate-400">({reviews})</span>
//                     </div>

//                     {tutor.pricePerHour !== undefined && (
//                       <p className="mt-2 text-sm font-bold text-slate-900">
//                         ${tutor.pricePerHour}/hr
//                       </p>
//                     )}
//                   </div>

//                   <Link
//                     href={`/tutors/${tutor._id}`}
//                     className="mt-5 w-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold py-2.5 hover:from-indigo-700 hover:to-blue-700 transition inline-flex items-center justify-center shadow-md"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//         </div>
//       </section>
//     </div>
//   );
// }



// "use client";

// import DashboardNavbar from "../_components/DashboardNavbar";
// import Footer from "../_components/Footer";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   fullName: string;
//   email: string;
//   username: string;
//   profileImage?: string;
//   subject?: string;
//   gradeLevel?: string;
//   pricePerHour?: number;
//   rating?: number;
//   reviewsCount?: number;
// }

// const filterChips = ["All", "Subject", "Grade Level", "Price", "Ratings"];
// const ITEMS_PER_PAGE = 6;

// const tutorMeta = [
//   { subject: "Math & Physics", rating: "4.9", reviews: "82" },
//   { subject: "English & History", rating: "4.8", reviews: "65" },
//   { subject: "Biology & Chemistry", rating: "4.9", reviews: "91" },
//   { subject: "SAT/ACT Prep", rating: "5.0", reviews: "120" },
// ];

// const getProfileImageUrl = (profileImage?: string) => {
//   if (!profileImage) return "";

//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

//   if (profileImage.startsWith("http")) {
//     return profileImage.replace("10.0.2.2", "localhost");
//   }

//   return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
// };

// export default function TutorsPage() {
//   const router = useRouter();
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

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

//   const filteredTutors = useMemo(() => {
//     if (!search.trim()) return tutors;
//     const term = search.toLowerCase();
//     return tutors.filter((tutor) =>
//       tutor.fullName.toLowerCase().includes(term) ||
//       tutor.username.toLowerCase().includes(term)
//     );
//   }, [search, tutors]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   const totalPages = Math.max(1, Math.ceil(filteredTutors.length / ITEMS_PER_PAGE));

//   const paginatedTutors = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredTutors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredTutors, currentPage]);

//   return (
//     <div className="min-h-screen bg-blue-50">
//       <DashboardNavbar />
//       <section className="py-10">
//         <div className="mx-auto w-full max-w-6xl px-6">

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="h-11 w-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-100 transition"
//             aria-label="Go back"
//           >
//             <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
//             Explore Tutors
//           </h1>

//           <button
//             type="button"
//             className="h-11 w-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-100 transition"
//             aria-label="Filters"
//           >
//             <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
//             </svg>
//           </button>
//         </div>

//         {/* Search */}
//         <div className="mt-8 rounded-2xl bg-white/50 backdrop-blur-md border border-blue-100 px-5 py-4 shadow-md flex items-center gap-3">
//           <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.3-4.3" />
//           </svg>
//           <input
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search by name or keyword..."
//             className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
//           />
//         </div>

//         {/* Filters */}
//         <div className="mt-6 flex flex-wrap gap-3">
//           {filterChips.map((chip, index) => (
//             <button
//               key={chip}
//               className={
//                 index === 0
//                   ? "px-5 py-2 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md"
//                   : "px-5 py-2 rounded-full bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-blue-50 transition"
//               }
//             >
//               <span className="flex items-center gap-2">
//                 {chip}
//                 {index !== 0 && (
//                   <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
//                   </svg>
//                 )}
//               </span>
//             </button>
//           ))}
//         </div>

//         {loading && (
//           <div className="mt-12 text-center text-blue-500 font-medium">Loading tutors...</div>
//         )}

//         {error && (
//           <div className="mt-12 text-center text-red-500 font-medium">{error}</div>
//         )}

//         {!loading && !error && filteredTutors.length === 0 && (
//           <div className="mt-12 text-center text-slate-500">No tutors available yet.</div>
//         )}

//         {!loading && !error && filteredTutors.length > 0 && (
//           <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {paginatedTutors.map((tutor, index) => {
//               const meta = tutorMeta[index % tutorMeta.length];
//               const subject = tutor.subject || meta.subject;
//               const rating = tutor.rating !== undefined ? tutor.rating.toFixed(1) : meta.rating;
//               const reviews = tutor.reviewsCount !== undefined ? String(tutor.reviewsCount) : meta.reviews;

//               return (
//                 <div
//                   key={tutor._id}
//                   className="group rounded-3xl bg-white/50 backdrop-blur-md border border-blue-100 p-5 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
//                 >
//                   <div className="rounded-2xl bg-blue-100/40 h-44 overflow-hidden flex items-center justify-center">
//                     {tutor.profileImage ? (
//                       <img
//                         src={getProfileImageUrl(tutor.profileImage)}
//                         alt={tutor.fullName}
//                         className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
//                       />
//                     ) : (
//                       <div className="h-20 w-20 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
//                         {tutor.fullName.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-5">
//                     <h3 className="text-lg font-bold text-slate-800">{tutor.fullName}</h3>
//                     <p className="text-sm text-blue-600 font-medium">{subject}</p>

//                     <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
//                       <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
//                       </svg>
//                       <span className="font-semibold">{rating}</span>
//                       <span className="text-slate-400">({reviews})</span>
//                     </div>

//                     {tutor.pricePerHour !== undefined && (
//                       <p className="mt-2 text-sm font-bold text-slate-900">
//                         ${tutor.pricePerHour}/hr
//                       </p>
//                     )}
//                   </div>

//                   <Link
//                     href={`/tutors/${tutor._id}`}
//                     className="mt-5 w-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-2.5 hover:from-blue-700 hover:to-indigo-700 transition inline-flex items-center justify-center shadow-md"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {!loading && !error && filteredTutors.length > ITEMS_PER_PAGE && (
//           <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
//             <button
//               type="button"
//               onClick={() => setCurrentPage((previousPage) => Math.max(1, previousPage - 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
//             >
//               Previous
//             </button>

//             {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1).map((pageNumber) => (
//               <button
//                 key={pageNumber}
//                 type="button"
//                 onClick={() => setCurrentPage(pageNumber)}
//                 className={
//                   currentPage === pageNumber
//                     ? "h-10 min-w-10 px-3 rounded-lg bg-blue-600 text-white text-sm font-semibold"
//                     : "h-10 min-w-10 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
//                 }
//               >
//                 {pageNumber}
//               </button>
//             ))}

//             <button
//               type="button"
//               onClick={() => setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }


// "use client";

// import DashboardNavbar from "../_components/DashboardNavbar";
// import Footer from "../_components/Footer";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { getTutors } from "@/lib/api/auth";

// interface Tutor {
//   _id: string;
//   fullName: string;
//   email: string;
//   username: string;
//   profileImage?: string;
//   subject?: string;
//   gradeLevel?: string;
//   pricePerHour?: number;
//   rating?: number;
//   reviewsCount?: number;
// }

// const filterChips = ["All", "Subject", "Grade Level", "Price", "Ratings"];
// const ITEMS_PER_PAGE = 6;

// const tutorMeta = [
//   { subject: "Math & Physics", rating: "4.9", reviews: "82" },
//   { subject: "English & History", rating: "4.8", reviews: "65" },
//   { subject: "Biology & Chemistry", rating: "4.9", reviews: "91" },
//   { subject: "SAT/ACT Prep", rating: "5.0", reviews: "120" },
// ];

// const getProfileImageUrl = (profileImage?: string) => {
//   if (!profileImage) return "";
//   const baseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

//   if (profileImage.startsWith("http")) {
//     return profileImage.replace("10.0.2.2", "localhost");
//   }

//   return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace(
//     "10.0.2.2",
//     "localhost"
//   );
// };

// export default function TutorsPage() {
//   const router = useRouter();
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

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
//       } catch (err: any) {
//         setError(err.message || "Failed to fetch tutors");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTutors();
//   }, []);

//   const filteredTutors = useMemo(() => {
//     if (!search.trim()) return tutors;
//     const term = search.toLowerCase();
//     return tutors.filter(
//       (tutor) =>
//         tutor.fullName.toLowerCase().includes(term) ||
//         tutor.username.toLowerCase().includes(term) ||
//         tutor.subject?.toLowerCase().includes(term)
//     );
//   }, [search, tutors]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredTutors.length / ITEMS_PER_PAGE)
//   );

//   const paginatedTutors = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredTutors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredTutors, currentPage]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <DashboardNavbar />

//       <section className="py-12">
//         <div className="mx-auto w-full max-w-6xl px-6">

//           {/* Header */}
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => router.back()}
//               className="h-11 w-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-100 transition"
//             >
//               <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>

//             <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
//               Explore Tutors
//             </h1>

//             <div className="w-11" />
//           </div>

//           {/* Search */}
//           <div className="mt-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 px-6 py-4 shadow-xl flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
//             <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="11" cy="11" r="8" />
//               <path d="m21 21-4.3-4.3" />
//             </svg>
//             <input
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               placeholder="Search tutors by name, subject..."
//               className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
//             />
//           </div>

//           {/* Cards */}
//           {!loading && !error && (
//             <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
//               {paginatedTutors.map((tutor, index) => {
//                 const meta = tutorMeta[index % tutorMeta.length];
//                 const subject = tutor.subject || meta.subject;
//                 const rating =
//                   tutor.rating !== undefined
//                     ? tutor.rating.toFixed(1)
//                     : meta.rating;
//                 const reviews =
//                   tutor.reviewsCount !== undefined
//                     ? String(tutor.reviewsCount)
//                     : meta.reviews;

//                 return (
//                   <div
//                     key={tutor._id}
//                     className="group relative rounded-3xl bg-white p-6 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
//                   >
//                     <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"></div>

//                     <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
//                       Available
//                     </span>

//                     <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 h-44 overflow-hidden flex items-center justify-center">
//                       {tutor.profileImage ? (
//                         <img
//                           src={getProfileImageUrl(tutor.profileImage)}
//                           alt={tutor.fullName}
//                           className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
//                         />
//                       ) : (
//                         <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
//                           {tutor.fullName.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                     </div>

//                     <div className="mt-5">
//                       <h3 className="text-xl font-bold text-slate-800">
//                         {tutor.fullName}
//                       </h3>

//                       <p className="text-sm font-medium text-indigo-600 mt-1">
//                         {subject}
//                       </p>

//                       <div className="mt-3 flex items-center gap-2 text-sm">
//                         <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
//                           <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
//                           </svg>
//                           <span className="font-semibold text-slate-800">
//                             {rating}
//                           </span>
//                         </div>
//                         <span className="text-slate-400 text-xs">
//                           ({reviews} reviews)
//                         </span>
//                       </div>

//                       {tutor.pricePerHour !== undefined && (
//                         <p className="mt-3 text-base font-bold text-green-600">
//                           ${tutor.pricePerHour}
//                           <span className="text-sm text-slate-500">
//                             {" "}
//                             / hour
//                           </span>
//                         </p>
//                       )}
//                     </div>

//                     <Link
//                       href={`/tutors/${tutor._id}`}
//                       className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 inline-flex items-center justify-center shadow-md hover:shadow-xl"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Pagination */}
//           {!loading && !error && filteredTutors.length > ITEMS_PER_PAGE && (
//             <div className="mt-14 flex items-center justify-center gap-3">
//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.max(1, prev - 1))
//                 }
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold disabled:opacity-40"
//               >
//                 Previous
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (pageNumber) => (
//                   <button
//                     key={pageNumber}
//                     onClick={() => setCurrentPage(pageNumber)}
//                     className={
//                       currentPage === pageNumber
//                         ? "h-10 min-w-10 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md"
//                         : "h-10 min-w-10 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
//                     }
//                   >
//                     {pageNumber}
//                   </button>
//                 )
//               )}

//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) =>
//                     Math.min(totalPages, prev + 1)
//                   )
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }



"use client";

import DashboardNavbar from "../_components/DashboardNavbar";
import Footer from "../_components/Footer";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTutors } from "@/lib/api/auth";

interface Tutor {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  subject?: string;
  gradeLevel?: string;
  pricePerHour?: number;
  rating?: number;
  reviewsCount?: number;
}

const ITEMS_PER_PAGE = 6;

const tutorMeta = [
  { subject: "Math & Physics", rating: "4.9", reviews: "82" },
  { subject: "English & History", rating: "4.8", reviews: "65" },
  { subject: "Biology & Chemistry", rating: "4.9", reviews: "91" },
  { subject: "SAT/ACT Prep", rating: "5.0", reviews: "120" },
];

const getProfileImageUrl = (profileImage?: string) => {
  if (!profileImage) return "";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  if (profileImage.startsWith("http")) {
    return profileImage.replace("10.0.2.2", "localhost");
  }

  return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace(
    "10.0.2.2",
    "localhost"
  );
};

export default function TutorsPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTutors();
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch tutors");
        }
        setTutors(result.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const filteredTutors = useMemo(() => {
    if (!search.trim()) return tutors;
    const term = search.toLowerCase();
    return tutors.filter(
      (tutor) =>
        tutor.fullName.toLowerCase().includes(term) ||
        tutor.username.toLowerCase().includes(term) ||
        tutor.subject?.toLowerCase().includes(term)
    );
  }, [search, tutors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTutors.length / ITEMS_PER_PAGE)
  );

  const paginatedTutors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTutors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTutors, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardNavbar />

      <section className="py-12">
        <div className="mx-auto w-full max-w-6xl px-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="h-11 w-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-100 transition"
            >
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Explore Tutors
            </h1>

            <div className="w-11" />
          </div>

          {/* Search */}
          <div className="mt-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 px-6 py-4 shadow-xl flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tutors by name, subject..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Cards */}
          {!loading && !error && (
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedTutors.map((tutor, index) => {
                const meta = tutorMeta[index % tutorMeta.length];
                const subject = tutor.subject || meta.subject;
                const rating =
                  tutor.rating !== undefined
                    ? tutor.rating.toFixed(1)
                    : meta.rating;
                const reviews =
                  tutor.reviewsCount !== undefined
                    ? String(tutor.reviewsCount)
                    : meta.reviews;

                return (
                  <div
                    key={tutor._id}
                    className="group relative rounded-3xl bg-white p-6 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"></div>

                    <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Available
                    </span>

                    <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 h-44 overflow-hidden flex items-center justify-center">
                      {tutor.profileImage ? (
                        <img
                          src={getProfileImageUrl(tutor.profileImage)}
                          alt={tutor.fullName}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        /* Centered Letter */
                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                          <span className="text-white text-3xl font-bold leading-none">
                            {tutor.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* <div className="mt-5"> */}
                      <div className="mt-5 text-center">
                      <h3 className="text-xl font-bold text-slate-800">
                        {tutor.fullName}
                      </h3>

                      <p className="text-sm font-medium text-indigo-600 mt-1">
                        {subject}
                      </p>

                      {/* <div className="mt-3 flex items-center gap-2 text-sm"> */}
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
                          </svg>
                          <span className="font-semibold text-slate-800">
                            {rating}
                          </span>
                        </div>
                        <span className="text-slate-400 text-xs">
                          ({reviews} reviews)
                        </span>
                      </div>

                      {tutor.pricePerHour !== undefined && (
                        <p className="mt-3 text-base font-bold text-green-600">
                          ${tutor.pricePerHour}
                          <span className="text-sm text-slate-500">
                            {" "}
                            / hour
                          </span>
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/tutors/${tutor._id}`}
                      className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 inline-flex items-center justify-center shadow-md hover:shadow-xl"
                    >
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination - moved further down */}
          {!loading && !error && filteredTutors.length > ITEMS_PER_PAGE && (
            <div className="mt-24 flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={
                      currentPage === pageNumber
                        ? "h-10 min-w-10 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md"
                        : "h-10 min-w-10 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                    }
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}