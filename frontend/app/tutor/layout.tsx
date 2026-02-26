import { redirect } from "next/navigation";
import { handleWhoAmI } from "@/lib/actions/auth-action";
import TutorSidebar from "./_components/Sidebar";
import TutorHeader from "./_components/Header";

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await handleWhoAmI();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  if (result.data.role !== "tutor") {
    redirect("/");
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="xl:block hidden">
        <TutorSidebar />
      </div>
      <div className="w-full xl:ml-64">
        <TutorHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-6 pt-22">
          {children}
        </main>
      </div>
    </div>
  );
}
