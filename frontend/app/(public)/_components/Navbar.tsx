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


import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo only
        <Link href="/">
          <img
            src="/images/tutorixlogohome.png"
            alt="Tutorix Logo"
            className="h-10 w-auto"
          />
        </Link>
         <h1 className="text-xl font-bold text-grey-600">Tutorix</h1> */}



          {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/tutorixlogohome.png"
            alt="Tutorix Logo"
            className="h-8 w-auto"
          />
          <span className="text-blue-500 text-xl font-bold">
            Tutorix
          </span>
        </Link>

        {/* Center menu */}
        <div className="hidden md:flex gap-6 text-sm text-blue-500">
          <Link href="/">Home</Link>
          <Link href="#">Tutors</Link>
          <Link href="#">Book Session</Link>
          <Link href="#">About</Link>
          <Link href="#">Contact</Link>
        </div>

        {/* Auth buttons */}
        <div className="flex gap-3">
          <Link
            href="/login"
            // className="text-sm font-medium text-white"
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

      </div>
    </nav>
  );
}
