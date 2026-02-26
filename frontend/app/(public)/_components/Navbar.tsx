// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="w-full bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

//         <h1 className="text-xl font-bold text-blue-600">Tutorix</h1>

//         <div className="hidden md:flex gap-6 text-sm">
//           <Link href="/">Home</Link>
//           <Link href="#">Tutors</Link>
//           <Link href="#">Book Session</Link>
//           <Link href="#">About</Link>
//           <Link href="#">Contact</Link>
//         </div>

//         <div className="flex gap-3">
//           <Link href="/login" className="text-sm font-medium">
//             Login
//           </Link>
//           <Link
//             href="/register"
//             className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm"
//           >
//             Register
//           </Link>
//         </div>

//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const authContext = useAuth();
  const { logout, user, isAuthenticated, loading } = authContext;



  // Log when user data arrives from context
  useEffect(() => {
    console.log("[Navbar useEffect] Dependencies changed. user=", user, "user?.role=", user?.role);
    if (user?.role) {
      console.log("[Navbar useEffect] GOT USER ROLE:", user.role);
      setRenderKey(prev => prev + 1);
    }
  }, [user, loading]);

  const getProfileImageUrl = () => {
    const rawUrl = user?.profileImage || user?.imageUrl;
    if (!rawUrl) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const imageUrl = rawUrl.startsWith("http")
      ? rawUrl
      : `${baseUrl}${rawUrl}`;
    return imageUrl.replace("10.0.2.2", "localhost");
  };

  const getUserInitial = () => {
    const name = user?.fullName || user?.username || user?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  // Show authenticated UI if user exists OR if isAuthenticated is true
  const shouldShowAuthUI = isAuthenticated || !!user;

  return (
    <nav className="sticky top-0 z-50 w-full bg-green-100 shadow-sm">
      <div className="w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img
            src="/images/tutorixlogohome.png"
            alt="Tutorix Logo"
            className="h-8 w-auto"
          />
          <span className="text-blue-500 text-xl font-bold">Tutorix</span>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex gap-8 text-sm text-blue-500">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <Link href="/tutors" className="hover:text-blue-700">Tutors</Link>
            <Link href="/categories" className="hover:text-blue-700">Categories</Link>
            <Link href="/about" className="hover:text-blue-700">About</Link>
          </div>

          {shouldShowAuthUI ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {getProfileImageUrl() ? (
                    <img
                      src={getProfileImageUrl()!}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    getUserInitial()
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-blue-500 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open && (
                <div key={renderKey} className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md text-sm z-50">
                  
                  <Link
                    href="/user/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    My Profile
                  </Link>
                  
                  <Link
                    href="/user/bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    My Bookings
                  </Link>

                  <Link
                    href="/user/saved"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Saved
                  </Link>

                  <Link
                    href="/user/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  
                  {/* Show Tutor Dashboard if user is a tutor */}
                  {(() => {
                    const isTutor = user && user.role === "tutor";
                    if (isTutor) {
                      return (
                        <Link
                          href="/tutor/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100 text-green-600 font-semibold"
                          onClick={() => setOpen(false)}
                        >
                          ✓ Tutor Dashboard
                        </Link>
                      );
                    }
                    return null;
                  })()}
   
                  
                  {/* Show Become a Tutor if user is NOT a tutor */}
                  {(() => {
                    const isNotTutor = user && user.role !== "tutor";
                    if (isNotTutor) {
                      return (
                        <Link
                          href="/user/become-tutor"
                          className="block px-4 py-2 hover:bg-gray-100 text-blue-600"
                          onClick={() => setOpen(false)}
                        >
                          Become a Tutor
                        </Link>
                      );
                    }
                    return null;
                  })()}
                  
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
