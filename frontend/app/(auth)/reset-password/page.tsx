"use client";

import ResetPasswordForm from "@/app/(auth)/_components/ResetPasswordForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
