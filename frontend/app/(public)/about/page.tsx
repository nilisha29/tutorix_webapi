export default function Page() {
    return (
        <section className="bg-linear-to-b from-emerald-50 via-sky-50 to-white py-16">
            <div className="mx-auto max-w-5xl px-6">
                <div className="rounded-3xl bg-white/90 border border-emerald-100 p-10 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tutorix</p>
                    <h1 className="mt-4 text-3xl font-semibold text-slate-900">About Us</h1>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                        Tutorix connects learners with expert tutors across subjects, grades, and schedules.
                        We believe learning should feel personal, encouraging, and results-driven.
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {[
                            { label: "Learners", value: "25K+" },
                            { label: "Tutors", value: "1.5K+" },
                            { label: "Sessions", value: "120K+" },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl bg-emerald-50/70 p-5">
                                <p className="text-xs uppercase text-slate-400">{item.label}</p>
                                <p className="mt-2 text-xl font-semibold text-slate-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}