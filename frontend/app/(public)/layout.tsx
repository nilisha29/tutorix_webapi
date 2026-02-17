

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="w-full">
            <main className="w-full">
                {children}
            </main>
        </section>
    );
}