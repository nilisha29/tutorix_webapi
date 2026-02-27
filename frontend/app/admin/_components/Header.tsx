// "use client";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";

// export default function Header() {
//     const { logout, user } = useAuth();

//     return (
//         <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-black/10 dark:border-white/10">
//             <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
//                 <div className="flex h-16 items-center justify-between">
//                     {/* Left: Logo & Title */}
//                     <div className="flex items-center gap-3">
//                         <Link href="/admin" className="flex items-center gap-2 group">
//                             <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background font-semibold">
//                                 A
//                             </span>
//                             <span className="text-base font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
//                                 Admin Panel
//                             </span>
//                         </Link>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="h-6 flex items-center justify-center text-xs font-semibold">
//                             {user?.email || 'Admin'}
//                         </div>
//                         <span className="text-sm font-medium sm:inline">
//                             <button
//                                 onClick={() => {
//                                     logout();
//                                 }}
//                                 className="w-full border flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-foreground/5 transition-colors text-left"
//                             >
//                                 Logout
//                             </button>
//                         </span>
//                     </div>
//                 </div>
//             </nav>
//         </header>
//     );
// }



"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { logout, user } = useAuth();

  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Admin Dashboard
            </span>
          </Link>

          {/* Right: User info */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {user?.email}
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
}
