// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useTransition } from "react";
// import { useRouter } from "next/navigation";

// import Navbar from "@/app/(public)/_components/Navbar";


// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type LoginData = z.infer<typeof loginSchema>;

// export default function LoginForm() {
//   const router = useRouter();
//   const [pending, startTransition] = useTransition();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const submit = async (data: LoginData) => {
//     startTransition(async () => {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Tutorix Login Data:", data);
//       // router.push("/dashboard");
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4">

//       {/* Email */}
//       <div>
//         <input
//           type="email"
//           placeholder="E-mail"
//           className="w-full h-11 rounded-md border px-3 text-sm outline-none"
//           {...register("email")}
//         />
//         {errors.email && (
//           <p className="text-xs text-red-600">{errors.email.message}</p>
//         )}
//       </div>

//       {/* Password */}
//       <div>
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full h-11 rounded-md border px-3 text-sm outline-none"
//           {...register("password")}
//         />
//         {errors.password && (
//           <p className="text-xs text-red-600">{errors.password.message}</p>
//         )}
//       </div>

//       {/* Login Button */}
//       <button
//         type="submit"
//         disabled={isSubmitting || pending}
//         className="w-full h-11 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60"
//       >
//         {isSubmitting || pending ? "Signing in..." : "Sign-In"}
//       </button>

//       {/* Google Login (UI only) */}
//       <button
//         type="button"
//         className="w-full h-11 rounded-md border flex items-center justify-center gap-2 text-sm"
//       >
//         <img src="/images/google photo.png" alt="Google" className="w-4 h-4" />
//         Sign in with Google
//       </button>

//       {/* Register Link */}
//       <p className="text-center text-sm">
//         Don’t have an account?{" "}
//         <Link href="/register" className="text-blue-600 font-semibold">
//           Create Account
//         </Link>
//       </p>
//     </form>

    
//   );
// }


"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const submit = async (data: LoginData) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Tutorix Login Data:", data);
      router.push("/dashboard"); // Redirect after login
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">

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

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full h-11 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Signing in..." : "Sign-In"}
      </button>

      {/* Google Login */}
      <button
        type="button"
        className="w-full h-11 rounded-md border flex items-center justify-center gap-2 text-sm"
      >
        <img src="/images/google photo.png" alt="Google" className="w-4 h-4" />
        Sign in with Google
      </button>

      {/* Register Link */}
      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 font-semibold">
          Create Account
        </Link>
      </p>
    </form>
  );
}

