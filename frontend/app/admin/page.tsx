// export default function Page() {
//     return (
//         <div>Admin Dashboard</div>
//     );
// }


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Page() {
//   const pathname = usePathname();

//   const menu = [
//     { name: "Dashboard", path: "/admin" },
//     { name: "Users", path: "/admin/users" },
//     { name: "Tutors", path: "/admin/tutors" },
//     { name: "Bookings", path: "/admin/bookings" },
//     { name: "Revenue", path: "/admin/revenue" },
//     { name: "Reports", path: "/admin/reports" },
//     { name: "Settings", path: "/admin/settings" },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-64 bg-white border-r px-5 py-6">
//         <h1 className="text-2xl font-bold text-blue-600 mb-8">
//           Tutorix
//           <span className="block text-sm font-normal text-gray-400">
//             Admin Panel
//           </span>
//         </h1>

//         <nav className="space-y-2">
//           {menu.map((item) => (
//             <Link
//               key={item.path}
//               href={item.path}
//               className={`block px-4 py-2 rounded-lg transition ${
//                 pathname === item.path
//                   ? "bg-blue-100 text-blue-600"
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               {item.name}
//             </Link>
//           ))}
//         </nav>

//         <button className="mt-10 text-red-500 hover:underline">
//           Logout
//         </button>
//       </aside>

//       {/* ================= MAIN ================= */}
//       <div className="flex-1 flex flex-col">
//         {/* ================= TOPBAR ================= */}
//         <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
//           <input
//             type="text"
//             placeholder="Search analytics, users or bookings..."
//             className="w-1/3 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />

//           <div className="flex items-center gap-3">
//             <div className="text-right">
//               <p className="text-sm font-medium">Alex Johnson</p>
//               <p className="text-xs text-gray-500">Super Admin</p>
//             </div>
//             <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
//               A
//             </div>
//           </div>
//         </header>

//         {/* ================= CONTENT ================= */}
//         <main className="p-6 space-y-6">
//           {/* Title */}
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-2xl font-bold">Dashboard Overview</h2>
//               <p className="text-gray-500">
//                 Welcome back, Alex. Here's what's happening today.
//               </p>
//             </div>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
//               Export Report
//             </button>
//           </div>

//           {/* ================= STATS ================= */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             {[
//               { title: "Total Users", value: "12,450", growth: "+12.5%" },
//               { title: "Total Tutors", value: "852", growth: "+5.2%" },
//               { title: "Active Bookings", value: "324", growth: "+8.1%" },
//               { title: "Total Revenue", value: "$45,200", growth: "+15.2%" },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-white p-6 rounded-xl shadow-sm"
//               >
//                 <div className="flex justify-between items-center">
//                   <p className="text-gray-500">{item.title}</p>
//                   <span className="text-green-600 text-sm">
//                     {item.growth}
//                   </span>
//                 </div>
//                 <h3 className="text-2xl font-bold mt-2">
//                   {item.value}
//                 </h3>
//               </div>
//             ))}
//           </div>

//           {/* ================= CHART + ACTIVITY ================= */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Chart */}
//             <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
//               <div className="flex justify-between mb-4">
//                 <h3 className="font-semibold">Booking Trends</h3>
//                 <select className="border rounded px-2 py-1 text-sm">
//                   <option>Last 7 Days</option>
//                   <option>Last 30 Days</option>
//                 </select>
//               </div>

//               <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400">
//                 Chart goes here
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white p-6 rounded-xl shadow-sm">
//               <h3 className="font-semibold mb-4">Recent Activity</h3>

//               <ul className="space-y-4 text-sm">
//                 <li>
//                   <strong>New Booking Confirmed</strong>
//                   <p className="text-gray-500">
//                     Sarah M. booked a session
//                   </p>
//                 </li>
//                 <li>
//                   <strong>New Tutor Application</strong>
//                   <p className="text-gray-500">
//                     James Wilson applied
//                   </p>
//                 </li>
//                 <li>
//                   <strong>Payment Disputed</strong>
//                   <p className="text-gray-500">
//                     Transaction requires attention
//                   </p>
//                 </li>
//                 <li>
//                   <strong>Tutor Verified</strong>
//                   <p className="text-gray-500">
//                     Maria Garcia approved
//                   </p>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* ================= PAGE TITLE ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-500">
            Welcome back, Alex. Here's what's happening today.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Export Report
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: "12,450", growth: "+12.5%" },
          { title: "Total Tutors", value: "852", growth: "+5.2%" },
          { title: "Active Bookings", value: "324", growth: "+8.1%" },
          { title: "Total Revenue", value: "$45,200", growth: "+15.2%" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-500">{item.title}</p>
              <span className="text-green-600 text-sm">
                {item.growth}
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* ================= CHART + ACTIVITY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Booking Trends</h3>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400">
            Chart goes here
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activity</h3>

          <ul className="space-y-4 text-sm">
            <li>
              <strong>New Booking Confirmed</strong>
              <p className="text-gray-500">
                Sarah M. booked a session
              </p>
            </li>

            <li>
              <strong>New Tutor Application</strong>
              <p className="text-gray-500">
                James Wilson applied
              </p>
            </li>

            <li>
              <strong>Payment Disputed</strong>
              <p className="text-gray-500">
                Transaction requires attention
              </p>
            </li>

            <li>
              <strong>Tutor Verified</strong>
              <p className="text-gray-500">
                Maria Garcia approved
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
