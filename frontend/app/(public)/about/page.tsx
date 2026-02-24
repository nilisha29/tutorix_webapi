// import DashboardNavbar from "../_components/DashboardNavbar";
// import Footer from "../_components/Footer";

// const steps = [
//     {
//         title: "Search Tutors",
//         description: "Browse by subject and compare tutor profiles, ratings, and pricing.",
//         icon: "🔎",
//     },
//     {
//         title: "Book & Pay Securely",
//         description: "Choose a suitable time slot and complete payment with trusted methods.",
//         icon: "💳",
//     },
//     {
//         title: "Learn & Grow",
//         description: "Attend sessions, track progress, and leave reviews to help the community.",
//         icon: "🎓",
//     },
// ];

// const benefits = [
//     {
//         title: "Verified Tutors",
//         description: "Tutor profiles are reviewed to maintain quality and trust.",
//         icon: "✅",
//     },
//     {
//         title: "Flexible Learning",
//         description: "Find sessions that match your level, schedule, and learning pace.",
//         icon: "🗓️",
//     },
//     {
//         title: "Transparent Ratings",
//         description: "Honest reviews and ratings help students choose confidently.",
//         icon: "⭐",
//     },
//     {
//         title: "Simple Experience",
//         description: "From discovery to booking, every step is clear and easy to use.",
//         icon: "✨",
//     },
// ];

// export default function Page() {
//     return (
//         <div className="min-h-screen bg-linear-to-b from-blue-50 via-sky-50 to-white">
//             <DashboardNavbar />

//             <section className="py-12">
//                 <div className="mx-auto max-w-6xl px-6">
//                     <div className="rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-sm md:p-10">
//                         <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tutorix</p>
//                         <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">About Tutorix</h1>
//                         <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
//                             Tutorix is a learning platform that connects students with skilled tutors across different subjects.
//                             Our goal is to make finding the right tutor simple, trusted, and effective for every learner.
//                         </p>

//                         <div className="mt-8 grid gap-4 sm:grid-cols-3">
//                             {[
//                                 { label: "Active Students", value: "25K+" },
//                                 { label: "Expert Tutors", value: "1.5K+" },
//                                 { label: "Sessions Completed", value: "120K+" },
//                             ].map((item) => (
//                                 <div key={item.label} className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
//                                     <p className="text-xs uppercase text-slate-500">{item.label}</p>
//                                     <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="mt-8 grid gap-6 lg:grid-cols-2">
//                         <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
//                             <div className="flex items-center gap-3">
//                                 <span className="text-2xl">🎯</span>
//                                 <h2 className="text-2xl font-semibold text-slate-900">Mission</h2>
//                             </div>
//                             <p className="mt-4 text-sm leading-relaxed text-slate-600">
//                                 Our mission is to empower every learner with access to personalized, high-quality tutoring.
//                                 We aim to build confidence, improve outcomes, and make education more accessible through
//                                 a reliable and student-friendly platform.
//                             </p>
//                         </div>

//                         <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
//                             <div className="flex items-center gap-3">
//                                 <span className="text-2xl">🚀</span>
//                                 <h2 className="text-2xl font-semibold text-slate-900">Why Tutorix</h2>
//                             </div>
//                             <p className="mt-4 text-sm leading-relaxed text-slate-600">
//                                 We focus on trust, simplicity, and real learning impact. Students can quickly compare tutors,
//                                 while tutors get a clear space to share expertise and grow their teaching profile.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
//                         <div className="flex items-center gap-3">
//                             <span className="text-2xl">🧭</span>
//                             <h2 className="text-2xl font-semibold text-slate-900">How It Works</h2>
//                         </div>

//                         <div className="mt-6 grid gap-4 md:grid-cols-3">
//                             {steps.map((step, index) => (
//                                 <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//                                     <div className="flex items-center justify-between">
//                                         <span className="text-2xl">{step.icon}</span>
//                                         <span className="text-xs font-semibold text-blue-600">STEP {index + 1}</span>
//                                     </div>
//                                     <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
//                                     <p className="mt-2 text-sm text-slate-600">{step.description}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
//                         <div className="flex items-center gap-3">
//                             <span className="text-2xl">💡</span>
//                             <h2 className="text-2xl font-semibold text-slate-900">Features & Benefits</h2>
//                         </div>

//                         <div className="mt-6 grid gap-4 sm:grid-cols-2">
//                             {benefits.map((benefit) => (
//                                 <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//                                     <div className="flex items-start gap-3">
//                                         <span className="text-xl">{benefit.icon}</span>
//                                         <div>
//                                             <h3 className="text-base font-semibold text-slate-900">{benefit.title}</h3>
//                                             <p className="mt-2 text-sm text-slate-600">{benefit.description}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <Footer />
//         </div>
//     );
// }




const steps = [
    {
        title: "Search Tutors",
        description: "Browse by subject and compare tutor profiles, ratings, and pricing.",
        icon: "🔎",
    },
    {
        title: "Book & Pay Securely",
        description: "Choose a suitable time slot and complete payment with trusted methods.",
        icon: "💳",
    },
    {
        title: "Learn & Grow",
        description: "Attend sessions, track progress, and leave reviews to help the community.",
        icon: "🎓",
    },
];

const benefits = [
    {
        title: "Verified Tutors",
        description: "Tutor profiles are reviewed to maintain quality and trust.",
        icon: "✅",
    },
    {
        title: "Flexible Learning",
        description: "Find sessions that match your level, schedule, and learning pace.",
        icon: "🗓️",
    },
    {
        title: "Transparent Ratings",
        description: "Honest reviews and ratings help students choose confidently.",
        icon: "⭐",
    },
    {
        title: "Simple Experience",
        description: "From discovery to booking, every step is clear and easy to use.",
        icon: "✨",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-sky-50 to-white">
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-6 space-y-16">

                    {/* Hero / Intro */}
                    <div className="rounded-4xl border border-blue-100 bg-white/90 p-10 shadow-lg text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tutorix</p>
                        <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">About Tutorix</h1>
                        <p className="mt-6 max-w-4xl mx-auto text-base leading-relaxed text-slate-700">
                            Tutorix is a learning platform that connects students with skilled tutors across different subjects.
                            Our goal is to make finding the right tutor simple, trusted, and effective for every learner.
                        </p>

                        {/* Stats */}
                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {[
                                { label: "Active Students", value: "25K+", bg: "from-blue-200 to-blue-50" },
                                { label: "Expert Tutors", value: "1.5K+", bg: "from-purple-200 to-purple-50" },
                                { label: "Sessions Completed", value: "120K+", bg: "from-green-200 to-green-50" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className={`rounded-3xl p-6 bg-gradient-to-r ${item.bg} shadow-md transform transition hover:scale-105`}
                                >
                                    <p className="text-xs uppercase text-slate-600">{item.label}</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mission & Why Tutorix */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="rounded-4xl bg-sky-50 p-8 shadow-md border border-blue-100 hover:shadow-lg transition">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🎯</span>
                                <h2 className="text-3xl font-semibold text-slate-900">Mission</h2>
                            </div>
                            <p className="mt-4 text-base text-slate-700 leading-relaxed">
                                Our mission is to empower every learner with access to personalized, high-quality tutoring.
                                We aim to build confidence, improve outcomes, and make education more accessible through
                                a reliable and student-friendly platform.
                            </p>
                        </div>

                        <div className="rounded-4xl bg-violet-50 p-8 shadow-md border border-violet-100 hover:shadow-lg transition">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🚀</span>
                                <h2 className="text-3xl font-semibold text-slate-900">Why Tutorix</h2>
                            </div>
                            <p className="mt-4 text-base text-slate-700 leading-relaxed">
                                We focus on trust, simplicity, and real learning impact. Students can quickly compare tutors,
                                while tutors get a clear space to share expertise and grow their teaching profile.
                            </p>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="rounded-4xl bg-green-50 p-8 shadow-md border border-green-100 hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🧭</span>
                            <h2 className="text-3xl font-semibold text-slate-900">How It Works</h2>
                        </div>

                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            {steps.map((step, index) => (
                                <div key={step.title} className="rounded-3xl p-6 bg-white shadow hover:shadow-lg transition transform hover:scale-105 border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl">{step.icon}</span>
                                        <span className="text-sm font-semibold text-green-600">STEP {index + 1}</span>
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features & Benefits */}
                    <div className="rounded-4xl bg-yellow-50 p-8 shadow-md border border-yellow-100 hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">💡</span>
                            <h2 className="text-3xl font-semibold text-slate-900">Features & Benefits</h2>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            {benefits.map((benefit) => (
                                <div key={benefit.title} className="rounded-3xl p-6 bg-white shadow hover:shadow-lg transition transform hover:scale-105 border border-slate-200">
                                    <div className="flex items-start gap-4">
                                        <span className="text-2xl">{benefit.icon}</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
                                            <p className="mt-2 text-sm text-slate-600">{benefit.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}