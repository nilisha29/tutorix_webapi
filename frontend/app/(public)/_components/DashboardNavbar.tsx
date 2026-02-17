// import Link from "next/link";

// export default function DashboardNavbar() {
//   return (
//     <nav className="w-full bg-blue-600 shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

//         {/* Logo + Name */}
//         <Link href="/" className="flex items-center gap-2">
//           <img
//             src="/images/logo.png"
//             alt="Tutorix Logo"
//             className="h-8 w-auto"
//           />
//           <span className="text-white text-xl font-bold">Tutorix</span>
//         </Link>

//         {/* Dashboard Links */}
//         <div className="flex gap-6 text-white text-sm">
//           <Link href="/auth/dashboard">Dashboard</Link>
//           <Link href="#">Profile</Link>
//           <Link href="#">Settings</Link>
//         </div>

//         {/* Logout */}
//         <Link
//           href="/login"
//           className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold"
//         >
//           Logout
//         </Link>
//       </div>
//     </nav>
//   );
// }


// import Link from "next/link";

// export default function DashboardNavbar() {
//   return (
//     <nav className="w-full bg-green-100 shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

//         {/* Logo only
//         <Link href="/">
//           <img
//             src="/images/tutorixlogohome.png"
//             alt="Tutorix Logo"
//             className="h-10 w-auto"
//           />
//         </Link>
//          <h1 className="text-xl font-bold text-grey-600">Tutorix</h1> */}



//           {/* Logo + Name */}
//         <Link href="/" className="flex items-center gap-2">
//           <img
//             src="/images/tutorixlogohome.png"
//             alt="Tutorix Logo"
//             className="h-8 w-auto"
//           />
//           <span className="text-blue-500 text-xl font-bold">
//             Tutorix
//           </span>
//         </Link>

//         {/* Center menu */}
//         <div className="hidden md:flex gap-6 text-sm text-blue-500">
//           <Link href="/">Home</Link>
//           <Link href="#">Tutors</Link>
//           <Link href="#">Book Session</Link>
//           <Link href="#">About</Link>
//           <Link href="#">Contact</Link>
//         </div>

//         {/* Auth buttons */}
//         <div className="flex gap-3">
//           <Link
//             href="/login"
//             // className="text-sm font-medium text-white"
//             className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold"
//           >
//             Login
//           </Link>

//           <Link
//             href="/register"
//             className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold"
//           >
//             Register
//           </Link>
//         </div>

//       </div>
//     </nav>
//   );
// }




// import Link from "next/link";

// export default function DashboardNavbar() {
//   return (
//     <nav className="w-full bg-green-100 shadow-sm">
//       <div className="w-full flex items-center justify-between px-6 py-4">

//         {/* Left: Logo */}
//         <div className="flex items-center gap-2">
//           <img
//             src="/images/tutorixlogohome.png"
//             alt="Tutorix Logo"
//             className="h-8 w-auto"
//           />
//           <span className="text-blue-500 text-xl font-bold">Tutorix</span>
//         </div>

//         {/* Center: Menu */}
//         <div className="hidden md:flex gap-10 text-sm text-blue-500">
//           <Link href="/">Home</Link>
//           <Link href="#">Tutors</Link>
//           <Link href="#">Book Session</Link>
//           <Link href="#">About</Link>
//           <Link href="#">Contact</Link>
//         </div>

//         {/* Right: Auth Buttons */}
//         {/* <div className="flex items-center gap-3">
//           <Link
//             href="/login"
//             className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold"
//           >
//             Login
//           </Link>
//           <Link
//             href="/register"
//             className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold"
//           >
//             Register
//           </Link>
//         </div> */}

//       </div>
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useState, useContext } from "react";
// import { useRouter } from "next/navigation";
// import { AuthContext } from "@/context/AuthContext";

// export default function DashboardNavbar() {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const { logout } = useContext(AuthContext);

//   const handleLogout = () => {
//     logout(); // clear user + token
//     router.push("/login");
//   };

//   return (
//     <nav className="w-full bg-green-100 shadow-sm">
//       <div className="w-full flex items-center justify-between px-6 py-4">

//         {/* Left: Logo */}
//         <div className="flex items-center gap-2">
//           <img
//             src="/images/tutorixlogohome.png"
//             alt="Tutorix Logo"
//             className="h-8 w-auto"
//           />
//           <span className="text-blue-500 text-xl font-bold">Tutorix</span>
//         </div>

//         {/* Center: Menu */}
//         <div className="hidden md:flex gap-10 text-sm text-blue-500">
//           <Link href="/">Home</Link>
//           <Link href="#">Tutors</Link>
//           <Link href="#">Book Session</Link>
//           <Link href="#">About</Link>
//           <Link href="#">Contact</Link>
//         </div>

//         {/* Right: Profile Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setOpen(!open)}
//             className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
//           >
//             U
//           </button>

//           {open && (
//             <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md text-sm">
//               <Link
//                 href="/user/profile"
//                 className="block px-4 py-2 hover:bg-gray-100"
//                 onClick={() => setOpen(false)}
//               >
//                 My Profile
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// export default function DashboardNavbar() {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const { logout, user } = useAuth(); // ✅ CORRECT

//   return (
//     <nav className="w-full bg-green-100 shadow-sm">
//       <div className="w-full flex items-center justify-between px-6 py-4">

//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <img
//             src="/images/tutorixlogohome.png"
//             alt="Tutorix Logo"
//             className="h-8 w-auto"
//           />
//           <span className="text-blue-500 text-xl font-bold">Tutorix</span>
//         </div>

//         {/* Menu */}
//         <div className="hidden md:flex gap-10 text-sm text-blue-500">
//           <Link href="/">Home</Link>
//           <Link href="#">Tutors</Link>
//           <Link href="#">Book Session</Link>
//           <Link href="#">About</Link>
//           <Link href="#">Contact</Link>
//         </div>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setOpen(!open)}
//             className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
//           >
//             {user?.name?.charAt(0) ?? "U"}
//           </button>

//           {open && (
//             <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md text-sm">
//               <Link
//                 href="/user/profile"
//                 className="block px-4 py-2 hover:bg-gray-100"
//                 onClick={() => setOpen(false)}
//               >
//                 My Profile
//               </Link>
//               <button
//                 onClick={logout}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// export default function DashboardNavbar() {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const { logout, user } = useAuth();

//   return (
//     <nav className="w-full bg-green-100 shadow-sm">
//       <div className="w-full flex items-center px-6 py-4 gap-10">

//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <img
//             src="/images/tutorixlogohome.png"
//             alt="Tutorix Logo"
//             className="h-8 w-auto"
//           />
//           <span className="text-blue-500 text-xl font-bold">Tutorix</span>
//         </div>

//         {/* Menu + Profile (LEFT SIDE) */}
//         <div className="flex items-center gap-10">

//           {/* Menu */}
//           <div className="hidden md:flex gap-8 text-sm text-blue-500">
//             <Link href="/">Home</Link>
//             <Link href="#">Tutors</Link>
//             <Link href="#">Book Session</Link>
//             <Link href="#">About</Link>
//             <Link href="#">Contact</Link>
//           </div>

//           {/* Profile Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setOpen(!open)}
//               className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
//             >
//               {user?.name?.charAt(0) ?? "U"}
//             </button>

//             {open && (
//               <div className="absolute left-0 mt-2 w-40 bg-white shadow-md rounded-md text-sm">
//                 <Link
//                   href="/user/profile"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpen(false)}
//                 >
//                   My Profile
//                 </Link>
//                 <button
//                   onClick={logout}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const { logout, user, isAuthenticated } = useAuth();

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

  return (
    <nav className="w-full bg-green-100 shadow-sm">
      <div className="w-full flex items-center justify-between px-6 py-4">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/images/tutorixlogohome.png"
            alt="Tutorix Logo"
            className="h-8 w-auto"
          />
          <span className="text-blue-500 text-xl font-bold">Tutorix</span>
        </div>

        {/* RIGHT: Menu + Profile */}
        <div className="flex items-center gap-10">

          {/* Menu */}
          <div className="hidden md:flex gap-8 text-sm text-blue-500">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <Link href="/tutors" className="hover:text-blue-700">Tutors</Link>
            <Link href="#" className="hover:text-blue-700">Book Session</Link>
            <Link href="/about" className="hover:text-blue-700">About</Link>
            <Link href="/contact" className="hover:text-blue-700">Contact</Link>
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
              >
                {getProfileImageUrl() ? (
                  <img
                    src={getProfileImageUrl()!}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  getUserInitial()
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md text-sm">
                  <Link
                    href="/user/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    My Profile
                  </Link>
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






