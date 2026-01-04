// "use client";

// import Link from "next/link";
// import { useState } from "react";

// export default function RegisterForm() {
//   const [accepted, setAccepted] = useState(false);

//   return (
//     <div className="w-full max-w-md">
//       <h2 className="text-2xl font-bold mb-6">Create Account</h2>

//       <form className="space-y-4">

//         <input
//           type="text"
//           placeholder="Full Name"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Confirm Password"
//           className="w-full border p-2 rounded"
//         />

//         {/* Terms & Conditions */}
//         <label className="flex items-center space-x-2 text-sm">
//           <input
//             type="checkbox"
//             checked={accepted}
//             onChange={(e) => setAccepted(e.target.checked)}
//           />
//           <span>
//             I accept all the{" "}
//             <Link href="#" className="text-blue-600 underline">
//               terms & conditions
//             </Link>
//           </span>
//         </label>

//         <button
//           type="submit"
//           disabled={!accepted}
//           className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
//         >
//           Sign Up
//         </button>

//       </form>

//       <p className="text-sm mt-4 text-center">
//         Already have an account?{" "}
//         <Link href="/login" className="text-blue-600 underline">
//           Sign In
//         </Link>
//       </p>
//     </div>
//   );
// }


"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms & conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const submit = async (data: RegisterData) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Tutorix Register Data:", data);
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">

      {/* Full Name */}
      <div>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full h-11 rounded-md border px-3 text-sm outline-none"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-xs text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="E-mail"
          className="w-full h-11 rounded-md border px-3 text-sm outline-none"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full h-11 rounded-md border px-3 text-sm outline-none"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full h-11 rounded-md border px-3 text-sm outline-none"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register("terms")} />
        <span>
          I accept all the{" "}
          <Link href="#" className="text-blue-600 font-semibold">
            terms & conditions
          </Link>
        </span>
      </div>
      {errors.terms && (
        <p className="text-xs text-red-600">{errors.terms.message}</p>
      )}

      {/* Register Button */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full h-11 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating account..." : "Sign Up"}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
