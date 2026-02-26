// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getTutorById } from "@/lib/api/auth";
// import Navbar from "../../_components/Navbar";
// import DashboardNavbar from "../../_components/DashboardNavbar";
// import Footer from "../../_components/Footer";
// import { useAuth } from "@/context/AuthContext";

// interface Tutor {
//   _id: string;
//   fullName: string;
//   username: string;
//   profileImage?: string;
//   subject?: string;
//   gradeLevel?: string;
//   pricePerHour?: number;
//   rating?: number;
//   reviewsCount?: number;
//   about?: string;
//   experienceYears?: number;
//   responseTime?: string;
//   languages?: string[];
//   tags?: string[];
//   education?: string[];
//   availabilitySlots?: { day: string; times: string[] }[];
//   reviews?: { name: string; detail: string; quote: string }[];
// }

// const getProfileImageUrl = (profileImage?: string) => {
//   if (!profileImage) return null;

//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

//   if (profileImage.startsWith("http")) {
//     return profileImage.replace("10.0.2.2", "localhost");
//   }

//   return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
// };

// export default function TutorDetailPage() {
//   const { isAuthenticated } = useAuth();
//   const params = useParams();
//   const tutorId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
//   const [tutor, setTutor] = useState<Tutor | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!tutorId) {
//       setTutor(null);
//       setLoading(false);
//       setError("Tutor not found.");
//       return;
//     }

//     const fetchTutor = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await getTutorById(tutorId);
//         if (!result.success) {
//           throw new Error(result.message || "Failed to fetch tutor");
//         }
//         setTutor(result.data || null);
//       } catch (err: Error | any) {
//         setError(err.message || "Failed to fetch tutor");
//         setTutor(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTutor();
//   }, [tutorId]);

//   if (loading || error || !tutor) {
//     return (
//       <div className="bg-linear-to-b from-emerald-50 via-sky-50 to-white min-h-screen">
//         {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
//         <section className="py-10">
//           <div className="mx-auto max-w-6xl px-6 text-slate-500">
//             {loading && "Loading tutor..."}
//             {error && <span className="text-red-500">{error}</span>}
//             {!loading && !error && !tutor && "Tutor not found."}
//           </div>
//         </section>
//         <Footer />
//       </div>
//     );
//   }

//   const rating = tutor.rating !== undefined ? tutor.rating.toFixed(1) : "5.0";
//   const reviewsCount = tutor.reviewsCount !== undefined ? tutor.reviewsCount : 128;
//   const pricePerHour = tutor.pricePerHour !== undefined ? tutor.pricePerHour : 45;
//   const subject = tutor.subject || "Expert Mathematics & Physics";
//   const experienceLabel = tutor.experienceYears !== undefined
//     ? `${tutor.experienceYears}+ Years`
//     : "Not provided";
//   const responseTime = tutor.responseTime || "Not provided";
//   const languages = Array.isArray(tutor.languages) 
//     ? tutor.languages 
//     : typeof tutor.languages === "string" 
//       ? (tutor.languages as string).split(",").map((l: string) => l.trim()) 
//       : [];
//   const tags = Array.isArray(tutor.tags) 
//     ? tutor.tags 
//     : typeof tutor.tags === "string" 
//       ? (tutor.tags as string).split(",").map((t: string) => t.trim()) 
//       : [];
//   const education = Array.isArray(tutor.education) 
//     ? tutor.education 
//     : typeof tutor.education === "string" 
//       ? (tutor.education as string).split("\n").map((e: string) => e.trim()).filter((e: string) => e) 
//       : [];
//   const availabilitySlots = tutor.availabilitySlots || [];
//   const reviews = tutor.reviews || [];

//   return (
//     <div className="bg-linear-to-b from-emerald-50 via-sky-50 to-white">
//       {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
//       <section className="py-10">
//         <div className="mx-auto max-w-6xl px-6">
//           {/* <div className="flex items-center gap-2 text-xs text-slate-400">
//             <Link href="/" className="hover:text-slate-500">Home</Link>
//             <span>/</span>
//             <Link href="/tutors" className="hover:text-slate-500">Tutor Search</Link>
//             <span>/</span>
//             <span className="text-slate-500">{tutor.fullName}</span>
//           </div> */}

//         <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
//           <div className="space-y-6">
//             <div className="rounded-2xl bg-white/90 p-6 shadow-sm border border-emerald-100">
//               <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
//                 <div className="relative h-20 w-20">
//                   {getProfileImageUrl(tutor.profileImage) ? (
//                     <img
//                       src={getProfileImageUrl(tutor.profileImage) || ""}
//                       alt={tutor.fullName}
//                       className="h-20 w-20 rounded-full object-cover border border-emerald-100"
//                     />
//                   ) : (
//                     <div className="h-20 w-20 rounded-full bg-linear-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-white font-bold text-2xl border border-emerald-100">
//                       {tutor.fullName.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                   <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <h1 className="text-2xl font-semibold text-slate-900">{tutor.fullName}</h1>
//                     <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-1 rounded-full">
//                       VERIFIED PROFILE
//                     </span>
//                   </div>
//                   <p className="mt-1 text-sm text-slate-500">{subject}</p>
//                   <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
//                     <span className="inline-flex items-center gap-1">
//                       <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
//                       </svg>
//                       {rating} ({reviewsCount} reviews)
//                     </span>
//                     <span className="inline-flex items-center gap-1">
//                       <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
//                       </svg>
//                       {languages.length > 0 ? `Speaks ${languages.join(", ")}` : "Languages not provided"}
//                     </span>
//                   </div>
//                   <div className="mt-4 flex flex-wrap gap-2 text-xs">
//                     {tags.length > 0 ? (
//                       tags.map((tag: string) => (
//                         <span key={tag} className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1">
//                           {tag}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1">No tags</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid gap-4 sm:grid-cols-3">
//               {[
//                 { label: "Experience", value: experienceLabel },
//                 { label: "Hourly Fee", value: `$${pricePerHour} / hour` },
//                 { label: "Response Time", value: responseTime },
//               ].map((item) => (
//                 <div key={item.label} className="rounded-2xl bg-white/90 p-5 border border-emerald-100 shadow-sm">
//                   <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
//                   <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="rounded-2xl bg-white/90 p-6 border border-emerald-100 shadow-sm">
//               <h2 className="text-lg font-semibold text-slate-900">About Me</h2>
//               <p className="mt-3 text-sm text-slate-600 leading-relaxed">
//                 {tutor.about || "No bio provided yet."}
//               </p>
//             </div>

//             <div className="rounded-2xl bg-white/90 p-6 border border-emerald-100 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
//                 <span className="text-xs text-slate-400">Oct 21 - Oct 27, 2023</span>
//               </div>
//               <div className="mt-4 grid gap-3 sm:grid-cols-7 text-xs">
//                 {availabilitySlots.length > 0 ? (
//                   availabilitySlots.map((slot) => (
//                     <div key={slot.day} className="rounded-xl bg-emerald-50/60 p-3 text-center">
//                       <p className="text-slate-400 font-semibold">{slot.day}</p>
//                       <div className="mt-2 space-y-2">
//                         {slot.times.map((time) => (
//                           <div
//                             key={time}
//                             className={
//                               "rounded-lg px-2 py-1 " +
//                               (time === "Booked" ? "bg-slate-200 text-slate-400" : "bg-sky-100 text-sky-700")
//                             }
//                           >
//                             {time}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-sm text-slate-500">No availability provided.</div>
//                 )}
//               </div>
//             </div>

//             <div className="rounded-2xl bg-white/90 p-6 border border-emerald-100 shadow-sm">
//               <h2 className="text-lg font-semibold text-slate-900">Recent Reviews</h2>
//               <div className="mt-4 space-y-4">
//                 {reviews.length > 0 ? (
//                   reviews.map((review) => (
//                     <div key={`${review.name}-${review.detail}`} className="rounded-xl border border-slate-200 p-4 bg-white">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-semibold text-slate-900">{review.name}</p>
//                           <p className="text-xs text-slate-400">{review.detail}</p>
//                         </div>
//                         <div className="flex text-yellow-500">
//                           {Array.from({ length: 5 }).map((_, index) => (
//                             <svg key={index} className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
//                               <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
//                             </svg>
//                           ))}
//                         </div>
//                       </div>
//                       <p className="mt-3 text-sm text-slate-600">{review.quote}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-sm text-slate-500">No reviews yet.</div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <aside className="space-y-6">
//             <div className="rounded-2xl bg-white/95 p-6 border border-emerald-100 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-slate-900">${pricePerHour}</h3>
//                 <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Money-back guarantee</span>
//               </div>
//               <div className="mt-4 space-y-3 text-sm text-slate-600">
//                 <div className="flex items-center justify-between">
//                   <span>Trial lesson (30 min)</span>
//                   <span className="text-green-600 font-semibold">FREE</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span>Selected: Oct 24, 09:00 AM</span>
//                   <span className="text-slate-900 font-semibold">${pricePerHour}.00</span>
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center justify-between text-sm font-semibold">
//                 <span>Total</span>
//                 <span>${pricePerHour}.00</span>
//               </div>
//               <button className="mt-5 w-full rounded-xl bg-sky-600 text-white py-3 text-sm font-semibold hover:bg-sky-700">
//                 Book Tutor
//               </button>
//               <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
//                 <button className="rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-50">
//                   Message
//                 </button>
//                 <button className="rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-50">
//                   Save
//                 </button>
//               </div>
//             </div>

//             <div className="rounded-2xl bg-white/95 p-6 border border-emerald-100 shadow-sm">
//               <h4 className="text-sm font-semibold text-slate-900">Quick Response</h4>
//               <p className="mt-2 text-xs text-slate-500">Usually responds in under 1 hour.</p>
//             </div>

//             <div className="rounded-2xl bg-white/95 p-6 border border-emerald-100 shadow-sm">
//               <h4 className="text-sm font-semibold text-slate-900">Education</h4>
//               {education.length > 0 ? (
//                 <ul className="mt-3 space-y-3 text-sm text-slate-600">
//                   {education.map((item: string) => (
//                     <li key={item}>{item}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="mt-3 text-sm text-slate-500">Education not provided.</p>
//               )}
//             </div>

//             <div className="rounded-2xl bg-emerald-50 p-4 text-xs text-slate-600 border border-emerald-100">
//               Secure payments processed by Tutorix. Your satisfaction is our priority.
//               Contact support if you need assistance.
//             </div>
//           </aside>
//         </div>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTutorById } from "@/lib/api/auth";
import { initiateBookingPayment } from "@/lib/api/booking";
import { sendTutorMessage } from "@/lib/api/message";
import { getMySavedTutors, removeSavedTutor, saveTutor } from "@/lib/api/saved-tutor";
import { useAuth } from "@/context/AuthContext";
import { handleSubmitTutorReview } from "@/lib/actions/tutor/review-action";
import { toast } from "react-toastify";


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
  reviews?: { reviewerId?: string; name: string; detail: string; profileImage?: string; quote: string; rating?: number }[];
}

const getProfileImageUrl = (profileImage?: string) => {
  if (!profileImage) return null;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  if (profileImage.startsWith("http")) return profileImage.replace("10.0.2.2", "localhost");
  return `${baseUrl}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`.replace("10.0.2.2", "localhost");
};

export default function TutorDetailPage() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const tutorId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("60 min");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "khalti" | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isSavedTutor, setIsSavedTutor] = useState(false);
  const [savingTutor, setSavingTutor] = useState(false);

  const handleMessageTutor = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first to message tutor");
      return;
    }

    const content = messageText.trim();
    if (!content) {
      toast.error("Please write a message");
      return;
    }

    try {
      setSendingMessage(true);
      await sendTutorMessage({ tutorId, content });
      setMessageText("");
      setShowMessageBox(false);
      toast.success("Message sent to tutor");
    } catch (error: Error | any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSaveTutor = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first to save tutor");
      return;
    }

    try {
      setSavingTutor(true);
      if (isSavedTutor) {
        await removeSavedTutor(tutorId);
        setIsSavedTutor(false);
        toast.success("Tutor unsaved");
      } else {
        await saveTutor(tutorId);
        setIsSavedTutor(true);
        toast.success("Tutor saved");
      }
    } catch (error: Error | any) {
      toast.error(error.message || "Failed to save tutor");
    } finally {
      setSavingTutor(false);
    }
  };

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
        if (!result.success) throw new Error(result.message || "Failed to fetch tutor");
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

  useEffect(() => {
    if (!isAuthenticated || !tutorId) {
      setIsSavedTutor(false);
      return;
    }

    const checkSavedStatus = async () => {
      try {
        const result = await getMySavedTutors();
        const savedList: any[] = result?.data || [];
        const alreadySaved = savedList.some((item) => String(item?.tutorId?._id) === String(tutorId));
        setIsSavedTutor(alreadySaved);
      } catch {
        setIsSavedTutor(false);
      }
    };

    checkSavedStatus();
  }, [isAuthenticated, tutorId]);


  const rating = tutor?.rating !== undefined ? tutor.rating.toFixed(1) : "5.0";
  const reviewsCount = tutor?.reviewsCount !== undefined ? tutor.reviewsCount : 128;
  const pricePerHour = tutor?.pricePerHour !== undefined ? tutor.pricePerHour : 45;
  const subject = tutor?.subject || "Expert Mathematics & Physics";
  const experienceLabel = tutor?.experienceYears !== undefined
    ? `${tutor.experienceYears}+ Years`
    : "Not provided";
  const responseTime = tutor?.responseTime || "Not provided";
  const languages = Array.isArray(tutor?.languages) 
    ? tutor.languages 
    : typeof tutor?.languages === "string" 
      ? (tutor.languages as string).split(",").map((l: string) => l.trim()) 
      : [];
  const tags = Array.isArray(tutor?.tags) 
    ? tutor.tags 
    : typeof tutor?.tags === "string" 
      ? (tutor.tags as string).split(",").map((t: string) => t.trim()) 
      : [];
  const education = Array.isArray(tutor?.education) 
    ? tutor.education 
    : typeof tutor?.education === "string" 
      ? (tutor.education as string).split("\n").map((e: string) => e.trim()).filter((e: string) => e) 
      : [];
  const availabilitySlots = tutor?.availabilitySlots || [];
  const reviews = tutor?.reviews || [];


  const normalizedAvailabilitySlots = availabilitySlots
    .map((slot) => {
      const parsed = new Date(slot.day);
      return {
        dayLabel: slot.day,
        parsedDate: Number.isNaN(parsed.getTime()) ? null : parsed,
        times: (Array.isArray(slot.times) ? slot.times : []).filter((time) => time && time !== "Booked"),
      };
    })
    .filter((slot) => slot.times.length > 0);

    
  useEffect(() => {
    if (normalizedAvailabilitySlots.length === 0) {
      setSelectedSlotIndex(0);
      setSelectedDate("");
      setSelectedTime("");
      return;
    }

    const safeIndex = Math.min(selectedSlotIndex, normalizedAvailabilitySlots.length - 1);
    if (safeIndex !== selectedSlotIndex) {
      setSelectedSlotIndex(safeIndex);
      return;
    }

    const activeSlot = normalizedAvailabilitySlots[safeIndex];
    if (selectedDate !== activeSlot.dayLabel) {
      setSelectedDate(activeSlot.dayLabel);
    }
  }, [normalizedAvailabilitySlots, selectedSlotIndex, selectedDate]);

  const activeAvailabilitySlot = normalizedAvailabilitySlots[selectedSlotIndex] || null;
  const selectedParsedDate = activeAvailabilitySlot?.parsedDate || null;
  const monthYearLabel = selectedParsedDate
    ? selectedParsedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Select Date";

  const availableTimesForSelectedDate = activeAvailabilitySlot?.times || [];

  useEffect(() => {
    if (availableTimesForSelectedDate.length === 0) {
      setSelectedTime("");
      return;
    }
    if (!availableTimesForSelectedDate.includes(selectedTime)) {
      setSelectedTime(availableTimesForSelectedDate[0]);
    }
  }, [availableTimesForSelectedDate, selectedTime]);

  const durationInMinutes = selectedDuration === "30 min" ? 30 : selectedDuration === "90 min" ? 90 : 60;
  const totalPrice = (pricePerHour * durationInMinutes) / 60;
  const totalPriceLabel = Number.isInteger(totalPrice) ? `${totalPrice}` : totalPrice.toFixed(2);
  const handleBookAndPay = async () => {
    const paymentMethod = selectedPaymentMethod;

    if (!isAuthenticated) {
      toast.error("Please login first to book and pay");
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please choose a payment method");
      return;
    }

    try {
      setProcessingPayment(true);
      setPaymentStatus("idle");
      const response = await initiateBookingPayment({
        tutorId,
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration,
        paymentMethod,
        amount: Number(totalPriceLabel),
      });

      const redirectUrl = response?.data?.redirectUrl;
      const redirectMethod = response?.data?.redirectMethod;
      const redirectFormFields = response?.data?.redirectFormFields;
      if (!redirectUrl) {
        throw new Error("Payment redirect URL not found");
      }

      if (redirectMethod === "POST" && redirectFormFields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = redirectUrl;

        Object.entries(redirectFormFields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      window.location.href = redirectUrl;
      return;
    } catch (error: Error | any) {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || error.message || "Failed to initiate payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  const onSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (!tutorId) {
      toast.error("Tutor not found");
      return;
    }

    try {
      setSubmittingReview(true);
      const result = await handleSubmitTutorReview(tutorId, {
        quote: reviewText.trim(),
        rating: reviewRating,
      });

      if (!result.success) {
        toast.error(result.message || "Failed to submit review");
        return;
      }

      if (result.data) {
        setTutor(result.data);
      }

      setReviewText("");
      setReviewRating(5);
      toast.success("Review submitted");
    } catch (error: Error | any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || error || !tutor) {
    return (
      <div className="bg-linear-to-b from-blue-50 via-white to-blue-50 min-h-screen">
        <section className="py-10">
          <div className="mx-auto max-w-6xl px-6 text-slate-500">
            {loading && "Loading tutor..."}
            {error && <span className="text-red-500">{error}</span>}
            {!loading && !error && !tutor && "Tutor not found."}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-blue-50 via-white to-blue-50 min-h-screen">
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">

              {/* Profile Card */}
              <div className="rounded-2xl bg-blue-50 p-6 shadow-lg border border-blue-200 hover:shadow-2xl transition duration-300">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-20">
                    {getProfileImageUrl(tutor.profileImage) ? (
                      <img
                        src={getProfileImageUrl(tutor.profileImage) || ""}
                        alt={tutor.fullName}
                        className="h-20 w-20 rounded-full object-cover border border-blue-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-2xl shadow-md border border-blue-200">
                        {tutor.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold text-slate-900">{tutor.fullName}</h1>
                      <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-1 rounded-full">
                        VERIFIED PROFILE
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{subject}</p>
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
                      {tags.length > 0 ? tags.map((tag: string) => (
                        <span key={tag} className="rounded-full bg-blue-100 text-blue-700 px-3 py-1">{tag}</span>
                      )) : <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-1">No tags</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience/Price/Response */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Experience", value: experienceLabel, color: "bg-green-50 text-green-700 border-green-200" },
                  { label: "Hourly Fee", value: `Rs ${pricePerHour} / hour`, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
                  { label: "Response Time", value: responseTime, color: "bg-pink-50 text-pink-700 border-pink-200" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition duration-300 ${item.color}`}>
                    <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="rounded-2xl bg-indigo-50 p-6 border border-indigo-200 shadow-sm hover:shadow-md transition duration-300">
                <h2 className="text-lg font-semibold text-slate-900">About Me</h2>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">{tutor.about || "No bio provided yet."}</p>
              </div>

              {/* Availability */}
              <div className="rounded-2xl bg-teal-50 p-6 border border-teal-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
                  <span className="text-xs text-slate-500">Oct 21 - Oct 27, 2023</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-7 text-xs">
                  {availabilitySlots.length > 0 ? availabilitySlots.map((slot) => (
                    <div key={slot.day} className="rounded-xl bg-teal-100/60 p-3 text-center">
                      <p className="text-slate-500 font-semibold">{slot.day}</p>
                      <div className="mt-2 space-y-2">
                        {slot.times.map((time) => (
                          <div
                            key={time}
                            className={`rounded-lg px-2 py-1 ${time === "Booked" ? "bg-slate-200 text-slate-400" : "bg-sky-200 text-sky-800"}`}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : <div className="text-sm text-slate-500">No availability provided.</div>}
                </div>
              </div>

              {/* Reviews */}
              <div className="rounded-2xl bg-pink-50 p-6 border border-pink-200 shadow-sm hover:shadow-md transition duration-300">
                <h2 className="text-lg font-semibold text-slate-900">Recent Reviews</h2>
                <div className="mt-4 space-y-4">
                  {reviews.length > 0 ? reviews.map((review) => (
                    <div key={`${review.name}-${review.detail}`} className="rounded-xl border border-pink-100 p-4 bg-pink-50 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {review.profileImage ? (
                            <img
                              src={getProfileImageUrl(review.profileImage) || ""}
                              alt={review.name}
                              className="h-10 w-10 rounded-full object-cover border border-pink-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-300 text-white flex items-center justify-center font-semibold">
                              {review.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                          <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                          <p className="text-xs text-slate-500">{review.detail}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, index) => {
                            const active = index < (review.rating || 5);
                            return (
                            <svg key={index} className={`h-4 w-4 ${active ? "text-yellow-500" : "text-slate-300"}`} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
                            </svg>
                          )})}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-700">{review.quote}</p>
                    </div>
                  )) : <div className="text-sm text-slate-500">No reviews yet.</div>}
                </div>

                <div className="mt-6 rounded-xl border border-pink-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Write a Review</h3>
                  <div className="mt-3 flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starValue = index + 1;
                      const active = starValue <= reviewRating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setReviewRating(starValue)}
                          className={active ? "text-yellow-500" : "text-slate-300"}
                          aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.8 6.5 19l1.1-6.1L3 8.5l6.3-.9L12 2z" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    placeholder="Share your learning experience with this tutor"
                    className="mt-3 w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
                    rows={4}
                  />
                  <button
                    type="button"
                    onClick={onSubmitReview}
                    disabled={submittingReview}
                    className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-lg">
                <h3 className="text-4xl font-bold text-slate-900">Rs {pricePerHour} <span className="text-2xl font-medium text-slate-600">/ hour</span></h3>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h4 className="text-2xl font-semibold text-slate-900">Select Date</h4>
                  <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                    <div className="mb-4 flex items-center justify-between text-sm font-medium text-slate-700">
                      <button
                        type="button"
                        onClick={() => setSelectedSlotIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={selectedSlotIndex === 0}
                        className="text-slate-500"
                      >
                        &lt;
                      </button>
                      <span>{monthYearLabel}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSlotIndex((prev) => Math.min(prev + 1, Math.max(normalizedAvailabilitySlots.length - 1, 0)))
                        }
                        disabled={selectedSlotIndex >= normalizedAvailabilitySlots.length - 1}
                        className="text-slate-500"
                      >
                        &gt;
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                      {normalizedAvailabilitySlots.map((slot, index) => {
                        const isSelected = index === selectedSlotIndex;
                        return (
                        <div key={`${slot.dayLabel}-${index}`}>
                          <div className="mb-2 font-semibold">
                            {slot.parsedDate
                              ? slot.parsedDate.toLocaleDateString("en-US", { weekday: "short" })
                              : `Slot ${index + 1}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedSlotIndex(index)}
                            className={isSelected ? "h-8 w-8 rounded-full bg-sky-600 text-white" : "h-8 w-8 rounded-full text-slate-700 hover:bg-sky-100"}
                          >
                            {slot.parsedDate ? slot.parsedDate.getDate() : index + 1}
                          </button>
                        </div>
                      )})}
                      {normalizedAvailabilitySlots.length === 0 && (
                        <div className="col-span-7 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                          No available dates from tutor availability slots
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-2xl font-semibold text-slate-900">Select Time</h4>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {availableTimesForSelectedDate.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? "rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white" : "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"}
                      >
                        {time}
                      </button>
                    ))}
                    {availableTimesForSelectedDate.length === 0 && (
                      <div className="col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                        No available times for selected date
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-2xl font-semibold text-slate-900">Select Duration</h4>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {["30 min", "60 min", "90 min"].map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setSelectedDuration(duration)}
                        className={selectedDuration === duration ? "rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white" : "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-2xl font-semibold text-slate-900">Payment Method</h4>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("esewa")}
                      disabled={processingPayment}
                      className={selectedPaymentMethod === "esewa" ? "rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white" : "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"}
                    >
                      eSewa
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("khalti")}
                      disabled={processingPayment}
                      className={selectedPaymentMethod === "khalti" ? "rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white" : "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"}
                    >
                      Khalti
                    </button>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h4 className="text-2xl font-semibold text-slate-900">Booking Summary</h4>
                  <div className="mt-3 space-y-2 text-base text-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Date:</span>
                      <span className="font-semibold">
                        {selectedParsedDate
                          ? selectedParsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : selectedDate || "Not selected"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Time:</span>
                      <span className="font-semibold">{selectedTime || "Not selected"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">{selectedDuration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pay Via:</span>
                      <span className="font-semibold">{selectedPaymentMethod === "esewa" ? "eSewa" : selectedPaymentMethod === "khalti" ? "Khalti" : "Not selected"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Status:</span>
                      <span className={`font-semibold ${paymentStatus === "success" ? "text-green-600" : paymentStatus === "failed" ? "text-red-600" : "text-slate-700"}`}>
                        {paymentStatus === "success" ? "Paid" : paymentStatus === "failed" ? "Failed" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total:</span>
                      <span className="font-semibold">Rs {totalPriceLabel}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookAndPay()}
                  disabled={processingPayment}
                  className="mt-6 w-full rounded-xl bg-emerald-600 text-white py-3 text-2xl font-semibold hover:bg-emerald-700 transition shadow-md disabled:opacity-60"
                >
                  {processingPayment ? "Redirecting..." : "Book & Pay"}
                </button>

                <p className="mt-2 text-xs text-slate-500">
                  You will be redirected to the selected payment gateway and returned after payment.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error("Please login first to message tutor");
                        return;
                      }
                      setShowMessageBox((prev) => !prev);
                    }}
                    className="rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-50"
                  >
                    Message
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTutor}
                    disabled={savingTutor}
                    className={isSavedTutor
                      ? "rounded-lg border border-yellow-300 bg-yellow-200 py-2 font-semibold text-yellow-800 hover:bg-yellow-300 disabled:opacity-70"
                      : "rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-70"}
                  >
                    {savingTutor ? "Saving..." : isSavedTutor ? "Saved" : "Save"}
                  </button>
                </div>

                {showMessageBox && (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <textarea
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      placeholder="Write your message to tutor..."
                      className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-700 outline-none"
                      rows={3}
                    />
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMessageBox(false);
                          setMessageText("");
                        }}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleMessageTutor}
                        disabled={sendingMessage}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                      >
                        {sendingMessage ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Response */}
              <div className="rounded-2xl bg-green-50 p-6 border border-green-200 shadow-sm hover:shadow-md transition duration-300">
                <h4 className="text-sm font-semibold text-slate-900">Quick Response</h4>
                <p className="mt-2 text-xs text-slate-700">Usually responds in under 1 hour.</p>
              </div>

              {/* Education */}
              <div className="rounded-2xl bg-purple-50 p-6 border border-purple-200 shadow-sm hover:shadow-md transition duration-300">
                <h4 className="text-sm font-semibold text-slate-900">Education</h4>
                {education.length > 0 ? (
                  <ul className="mt-3 space-y-3 text-sm text-slate-700">
                    {education.map((item: string) => <li key={item}>{item}</li>)}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Education not provided.</p>
                )}
              </div>

              <div className="rounded-2xl bg-blue-100 p-4 text-xs text-slate-600 border border-blue-200">
                Secure payments processed by Tutorix. Your satisfaction is our priority.
                Contact support if you need assistance.
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
