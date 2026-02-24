"use client";

import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="w-full flex flex-col min-h-screen">
            <Navbar />
            <main className="w-full flex-1">
                {children}
            </main>
            <Footer />
        </section>
    );
}