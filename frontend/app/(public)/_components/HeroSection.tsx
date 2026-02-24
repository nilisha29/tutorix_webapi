export default function HeroSection() {
  return (
    <section className="bg-slate-50 pt-8 pb-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-sky-200 via-indigo-200 to-violet-200 shadow-xl">
          <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-indigo-300/15" />
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -right-10 -top-8 h-64 w-64 rounded-full bg-indigo-300/40 blur-3xl" />
          <div className="absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="relative z-10 grid items-center gap-10 px-8 py-10 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-12">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-700/80">Tutorix</p>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-slate-900 leading-tight fade-up">
                Learn better with the right tutor.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-700 fade-up fade-up-delay-1">
                Personalized sessions for school, college, and skills — online or in person.
              </p>

              <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/80 p-3 shadow-lg backdrop-blur-sm fade-up fade-up-delay-2 sm:flex-row">
                <div className="flex-1 flex items-center gap-3 rounded-xl bg-white px-4 py-3">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by subject, level, or keyword..."
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50">
                  Filters
                </button>
                <button className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700">
                  Search
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">1200+ Tutors</span>
                <span className="h-1 w-1 rounded-full bg-slate-500" />
                <span className="font-semibold text-slate-900">4.9 Average Rating</span>
              </div>
            </div>


            <div className="relative flex justify-center lg:justify-end">
              {/* <div className="w-full max-w-140 rounded-3xl bg-white/90 p-4 shadow-2xl sm:p-5"> */}
                <img
                  src="/images/heroo.png"
                  alt="Tutor teaching a student"
                  className="w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </section>
  );
}
