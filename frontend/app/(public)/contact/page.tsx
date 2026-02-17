export default function Page() {
    return (
        <section className="bg-linear-to-b from-emerald-50 via-sky-50 to-white py-16">
            <div className="mx-auto max-w-5xl px-6">
                <div className="rounded-3xl bg-white/90 border border-emerald-100 p-10 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tutorix</p>
                    <h1 className="mt-4 text-3xl font-semibold text-slate-900">Contact</h1>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                        Have questions or need help booking a tutor? Reach out and our team will respond quickly.
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-emerald-50/70 p-5">
                            <p className="text-xs uppercase text-slate-400">Email</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">support@tutorix.com</p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50/70 p-5">
                            <p className="text-xs uppercase text-slate-400">Phone</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">+1 (555) 204-8899</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
