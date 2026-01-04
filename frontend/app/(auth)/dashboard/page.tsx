import DashboardNavbar from "@/app/(public)/_components/DashboardNavbar";

// export default function DashboardPage() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <DashboardNavbar />

//       {/* <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Dashboard (Dummy Page)
//         </h1>
//       </div> */}
//     </div>
//   );
// }


export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <DashboardNavbar />

      <div className="flex items-center justify-center h-[calc(100vh-64px)] w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard (Dummy Page)
        </h1>
      </div>
    </div>
  );
}

