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

  const getProfileImageUrl = () => {
    const rawUrl = user?.profileImage || user?.imageUrl;
    if (!rawUrl) return "";
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const imageUrl = rawUrl.startsWith("http") ? rawUrl : `${baseUrl}${rawUrl}`;
    return imageUrl.replace("10.0.2.2", "localhost");
  };

  const displayName = user?.fullName || user?.username || "Admin";

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-lg font-semibold text-slate-100">
              Admin Dashboard
            </span>
          </Link>

          {/* Right: User info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getProfileImageUrl() ? (
                <img
                  src={getProfileImageUrl()}
                  alt={displayName}
                    className="h-9 w-9 rounded-full object-cover border border-slate-600"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-slate-700 text-slate-100 text-sm font-semibold flex items-center justify-center">
                  {String(displayName).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-sm leading-tight">
                <p className="font-semibold text-slate-100">{displayName}</p>
                <p className="text-slate-300">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm rounded-md border border-slate-500 text-slate-100 hover:bg-slate-800 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
}
