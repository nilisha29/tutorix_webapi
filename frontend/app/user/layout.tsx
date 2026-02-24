import Navbar from "@/app/(public)/_components/Navbar";
import Footer from "@/app/(public)/_components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen flex flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <Footer />
        </section>
    );
}