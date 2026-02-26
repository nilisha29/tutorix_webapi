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

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAllUsers } from "@/lib/api/admin/user";
import { getAllBookingsForAdmin } from "@/lib/api/booking";

type AdminUser = {
  _id: string;
  role?: string;
  fullName?: string;
  username?: string;
  createdAt?: string;
};

type AdminBooking = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  amount?: number;
  bookingStatus?: string;
  paymentStatus?: string;
  studentId?: {
    fullName?: string;
    username?: string;
  };
  tutorId?: {
    fullName?: string;
    username?: string;
  };
};

const percentChangeLabel = (currentValue: number, previousValue: number) => {
  if (previousValue === 0) {
    if (currentValue === 0) return "0.0%";
    return "+100.0%";
  }

  const percent = ((currentValue - previousValue) / previousValue) * 100;
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
};

const dateFromAny = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendRange, setTrendRange] = useState<7 | 30>(7);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersData, bookingsData] = await Promise.all([
          getAllUsers(),
          getAllBookingsForAdmin(),
        ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setBookings(Array.isArray(bookingsData?.data) ? bookingsData.data : []);
      } catch (err: Error | any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const dashboardStats = useMemo(() => {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 2 * weekMs;
    const oneWeekAgo = now - weekMs;

    const tutors = users.filter((item) => item.role === "tutor");
    const activeBookings = bookings.filter(
      (item) => item.bookingStatus === "pending" || item.bookingStatus === "confirmed"
    );
    const totalRevenue = bookings
      .filter((item) => item.paymentStatus === "paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const usersCurrentWeek = users.filter((item) => {
      const date = dateFromAny(item.createdAt);
      if (!date) return false;
      const time = date.getTime();
      return time >= oneWeekAgo && time <= now;
    }).length;

    const usersPreviousWeek = users.filter((item) => {
      const date = dateFromAny(item.createdAt);
      if (!date) return false;
      const time = date.getTime();
      return time >= twoWeeksAgo && time < oneWeekAgo;
    }).length;

    const tutorsCurrentWeek = tutors.filter((item) => {
      const date = dateFromAny(item.createdAt);
      if (!date) return false;
      const time = date.getTime();
      return time >= oneWeekAgo && time <= now;
    }).length;

    const tutorsPreviousWeek = tutors.filter((item) => {
      const date = dateFromAny(item.createdAt);
      if (!date) return false;
      const time = date.getTime();
      return time >= twoWeeksAgo && time < oneWeekAgo;
    }).length;

    const bookingsCurrentWeek = bookings.filter((item) => {
      const date = dateFromAny(item.createdAt || item.date);
      if (!date) return false;
      const time = date.getTime();
      return time >= oneWeekAgo && time <= now;
    }).length;

    const bookingsPreviousWeek = bookings.filter((item) => {
      const date = dateFromAny(item.createdAt || item.date);
      if (!date) return false;
      const time = date.getTime();
      return time >= twoWeeksAgo && time < oneWeekAgo;
    }).length;

    const revenueCurrentWeek = bookings
      .filter((item) => {
        const date = dateFromAny(item.createdAt || item.date);
        if (!date || item.paymentStatus !== "paid") return false;
        const time = date.getTime();
        return time >= oneWeekAgo && time <= now;
      })
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const revenuePreviousWeek = bookings
      .filter((item) => {
        const date = dateFromAny(item.createdAt || item.date);
        if (!date || item.paymentStatus !== "paid") return false;
        const time = date.getTime();
        return time >= twoWeeksAgo && time < oneWeekAgo;
      })
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      totalUsers: users.length,
      totalTutors: tutors.length,
      activeBookings: activeBookings.length,
      totalRevenue,
      usersGrowth: percentChangeLabel(usersCurrentWeek, usersPreviousWeek),
      tutorsGrowth: percentChangeLabel(tutorsCurrentWeek, tutorsPreviousWeek),
      bookingsGrowth: percentChangeLabel(bookingsCurrentWeek, bookingsPreviousWeek),
      revenueGrowth: percentChangeLabel(revenueCurrentWeek, revenuePreviousWeek),
    };
  }, [users, bookings]);

  const bookingTrend = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const points = Array.from({ length: trendRange }).map((_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (trendRange - 1 - index));

      const start = new Date(day);
      const end = new Date(day);
      end.setDate(end.getDate() + 1);

      const count = bookings.filter((booking) => {
        const bookingDate = dateFromAny(booking.createdAt || booking.date);
        if (!bookingDate) return false;
        return bookingDate >= start && bookingDate < end;
      }).length;

      return {
        label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: count,
      };
    });

    const maxValue = Math.max(1, ...points.map((point) => point.value));
    return { points, maxValue };
  }, [bookings, trendRange]);

  const recentActivity = useMemo(() => {
    const bookingEvents = bookings.slice(0, 12).map((booking) => {
      const when = dateFromAny(booking.createdAt || booking.updatedAt || booking.date)?.getTime() || 0;
      const student = booking.studentId?.fullName || booking.studentId?.username || "Student";
      const tutor = booking.tutorId?.fullName || booking.tutorId?.username || "Tutor";

      return {
        key: `booking-${booking._id}`,
        time: when,
        title: `Booking ${booking.bookingStatus || "updated"}`,
        detail: `${student} with ${tutor}`,
      };
    });

    const userEvents = users.slice(0, 12).map((user) => {
      const when = dateFromAny(user.createdAt)?.getTime() || 0;
      const name = user.fullName || user.username || "User";
      return {
        key: `user-${user._id}`,
        time: when,
        title: user.role === "tutor" ? "New tutor registered" : "New user registered",
        detail: name,
      };
    });

    return [...bookingEvents, ...userEvents]
      .sort((a, b) => b.time - a.time)
      .slice(0, 6);
  }, [users, bookings]);

  const managementCounts = useMemo(() => {
    const tutorCount = users.filter((item) => item.role === "tutor").length;
    const pendingBookingsCount = bookings.filter((item) => item.bookingStatus === "pending").length;
    const paidPaymentsCount = bookings.filter((item) => item.paymentStatus === "paid").length;
    const reviewCount = users.reduce((sum, item: any) => sum + (Array.isArray(item.reviews) ? item.reviews.length : 0), 0);
    return { tutorCount, pendingBookingsCount, paidPaymentsCount, reviewCount };
  }, [users, bookings]);

  return (
    <div className="space-y-6">
      {/* ================= PAGE TITLE ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-500">
            Monitor users, tutors, bookings, payments, and activity in real time.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/admin/tutors" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
          <p className="text-sm text-gray-500">Manage</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">Tutors</h3>
          <p className="text-xs text-gray-500 mt-1">{managementCounts.tutorCount} total tutors</p>
        </Link>
        <Link href="/admin/bookings" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
          <p className="text-sm text-gray-500">Manage</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">Bookings</h3>
          <p className="text-xs text-gray-500 mt-1">{managementCounts.pendingBookingsCount} pending</p>
        </Link>
        <Link href="/admin/payments" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
          <p className="text-sm text-gray-500">Manage</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">Payments</h3>
          <p className="text-xs text-gray-500 mt-1">{managementCounts.paidPaymentsCount} paid</p>
        </Link>
        <Link href="/admin/reviews" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition">
          <p className="text-sm text-gray-500">Manage</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">Reviews</h3>
          <p className="text-xs text-gray-500 mt-1">{managementCounts.reviewCount} total reviews</p>
        </Link>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            value: String(dashboardStats.totalUsers),
            growth: dashboardStats.usersGrowth,
          },
          {
            title: "Total Tutors",
            value: String(dashboardStats.totalTutors),
            growth: dashboardStats.tutorsGrowth,
          },
          {
            title: "Active Bookings",
            value: String(dashboardStats.activeBookings),
            growth: dashboardStats.bookingsGrowth,
          },
          {
            title: "Total Revenue",
            value: `Rs ${dashboardStats.totalRevenue.toFixed(2)}`,
            growth: dashboardStats.revenueGrowth,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-500">{item.title}</p>
              <span className={`text-sm ${item.growth.startsWith("-") ? "text-red-600" : "text-green-600"}`}>
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
            <select
              value={trendRange}
              onChange={(event) => setTrendRange(Number(event.target.value) as 7 | 30)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>

          <div className="h-64 bg-blue-50 rounded-lg px-3 py-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-blue-400">Loading trend...</div>
            ) : (
              <div className="h-full flex items-end gap-1.5">
                {bookingTrend.points.map((point, index) => {
                  const heightPercent = (point.value / bookingTrend.maxValue) * 100;
                  return (
                    <div key={`${point.label}-${index}`} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        title={`${point.label}: ${point.value} bookings`}
                        className="w-full max-w-4 rounded-t bg-blue-500 hover:bg-blue-600 transition"
                        style={{ height: `${Math.max(6, heightPercent)}%` }}
                      />
                      {(trendRange === 7 || index % 5 === 0 || index === bookingTrend.points.length - 1) && (
                        <span className="mt-1 text-[10px] text-gray-500">{point.label}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activity</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading activity...</p>
          ) : recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity found.</p>
          ) : (
            <ul className="space-y-4 text-sm">
              {recentActivity.map((activity) => (
                <li key={activity.key}>
                  <strong>{activity.title}</strong>
                  <p className="text-gray-500">{activity.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
