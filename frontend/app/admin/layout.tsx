// import Header from "./_components/Header";
// import Sidebar from "./_components/Sidebar";

// export default function Layout({ children }: { children: React.ReactNode }) {
//     return (
//         <div className='flex w-full min-h-screen'>
//             <div className='page-wrapper flex w-full'>
//                 {/* Header/sidebar */}
//                 <div className='xl:block hidden'>
//                     <Sidebar />
//                 </div>
//                 <div className='w-full bg-background'>
//                     {/* Top Header  */}
//                     <Header />
//                     {/* Body Content  */}
//                     <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-2">
//                         {children}
//                     </main>
//                 </div>
//             </div>
//         </div>
//     );
// }


import { redirect } from "next/navigation";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { handleWhoAmI } from "@/lib/actions/auth-action";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await handleWhoAmI();

  // ❌ Not logged in
  if (!result.success || !result.data) {
    redirect("/login");
  }

  // ❌ Logged in but NOT admin
  if (result.data.role !== "admin") {
    redirect("/user/profile"); // or "/" if you prefer
  }

  // ✅ Admin allowed
  return (
    <div className="flex w-full min-h-screen">
      <div className="page-wrapper flex w-full">
        {/* Sidebar */}
        <div className="xl:block hidden">
          <Sidebar />
        </div>

        <div className="w-full bg-background">
          {/* Header */}
          <Header />

          {/* Body */}
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
