// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const ADMIN_LINKS = [
//     { href: "/admin", label: "Dashboard" },
//     { href: "/admin/users", label: "Users" },
// ];

// export default function Sidebar() {
//     const pathname = usePathname();

//     const isActive = (href: string) => href === "/admin" ? pathname === href : pathname?.startsWith(href);

//     return (
//         <>
//             {/* Sidebar */}
//             <aside className={`
//                 fixed md:static 
//                 top-0 left-0 
//                 h-screen w-64 
//                 bg-white dark:bg-gray-900 
//                 border-r border-gray-200 dark:border-gray-800 
//                 z-40 overflow-y-auto`}
//             >
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-800">
//                     <Link href="/admin" className="flex items-center gap-2">
//                         <div className="h-8 w-8 rounded bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-bold">A</div>
//                         <span className="font-semibold">Admin Panel</span>
//                     </Link>
//                 </div>

//                 <nav className="p-2 space-y-1">
//                     {
//                         ADMIN_LINKS.map(link => (
//                             <Link
//                                 key={link.href}
//                                 href={link.href}
//                                 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
//                                     ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
//                                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                                     }`}
//                             >
//                                 <span>{link.label}</span>
//                             </Link >
//                         ))
//                     }
//                 </nav >
//             </aside >
//         </>
//     );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/tutors", label: "Tutors" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
          A
        </div>
        <span className="ml-3 font-semibold text-gray-800 dark:text-gray-100">
          Admin Panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {ADMIN_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium transition
              ${
                isActive(link.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>

    </aside>
  );
}
