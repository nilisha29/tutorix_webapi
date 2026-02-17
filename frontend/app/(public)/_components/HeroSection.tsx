export default function HeroSection() {
  return (
    <section className="bg-slate-50 pt-10 pb-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
          <img
            src="/images/homepagetutorix.png"
            alt="Tutorix Hero"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />

          <div className="relative z-10 px-8 py-14 sm:px-12 sm:py-16 md:py-20 md:max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200/80">Tutorix</p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-white leading-tight fade-up">
              Unlock your full potential.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200 fade-up fade-up-delay-1">
              Find top-rated local and online tutors for any subject in seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 bg-white/90 p-3 rounded-2xl shadow-lg fade-up fade-up-delay-2">
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
          </div>
        </div>
      </div>
    </section>
  );
}
