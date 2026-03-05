"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const TUTOR_LINKS = [
  { href: "/tutor/dashboard", label: "Dashboard" },
  { href: "/tutor/profile", label: "Profile" },
  { href: "/tutor/bookings", label: "Bookings" },
  { href: "/tutor/messages", label: "Messages" },
  { href: "/tutor/reviews", label: "Reviews" },
  { href: "/tutor/earnings", label: "Earnings" },
];

export default function TutorSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-emerald-950 border-r border-emerald-800 z-50">
      <div className="h-16 flex items-center px-6 border-b border-emerald-800">
        <div className="h-9 w-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
          T
        </div>
        <span className="ml-3 font-semibold text-emerald-100">Tutor Panel</span>
      </div>

      <nav className="p-4 space-y-2">
        {TUTOR_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium transition ${
              isActive(link.href)
                ? "bg-emerald-500 text-white"
                : "text-emerald-100 hover:bg-emerald-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
