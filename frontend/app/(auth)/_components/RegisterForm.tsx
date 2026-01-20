// // "use client";

// // import Link from "next/link";
// // import { useState } from "react";

// // export default function RegisterForm() {
// //   const [accepted, setAccepted] = useState(false);

// //   return (
// //     <div className="w-full max-w-md">
// //       <h2 className="text-2xl font-bold mb-6">Create Account</h2>

// //       <form className="space-y-4">

// //         <input
// //           type="text"
// //           placeholder="Full Name"
// //           className="w-full border p-2 rounded"
// //         />

// //         <input
// //           type="email"
// //           placeholder="Email"
// //           className="w-full border p-2 rounded"
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="w-full border p-2 rounded"
// //         />

// //         <input
// //           type="password"
// //           placeholder="Confirm Password"
// //           className="w-full border p-2 rounded"
// //         />

// //         {/* Terms & Conditions */}
// //         <label className="flex items-center space-x-2 text-sm">
// //           <input
// //             type="checkbox"
// //             checked={accepted}
// //             onChange={(e) => setAccepted(e.target.checked)}
// //           />
// //           <span>
// //             I accept all the{" "}
// //             <Link href="#" className="text-blue-600 underline">
// //               terms & conditions
// //             </Link>
// //           </span>
// //         </label>

// //         <button
// //           type="submit"
// //           disabled={!accepted}
// //           className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
// //         >
// //           Sign Up
// //         </button>

// //       </form>

// //       <p className="text-sm mt-4 text-center">
// //         Already have an account?{" "}
// //         <Link href="/login" className="text-blue-600 underline">
// //           Sign In
// //         </Link>
// //       </p>
// //     </div>
// //   );
// // }


// // "use client";

// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import Link from "next/link";
// // import { useTransition } from "react";

// // const registerSchema = z
// //   .object({
// //     fullName: z.string().min(2, "Full name is required"),
// //     email: z.string().email("Enter a valid email"),
// //     password: z.string().min(6, "Password must be at least 6 characters"),
// //     confirmPassword: z.string().min(6),
// //     terms: z.boolean().refine((val) => val === true, {
// //       message: "You must accept the terms & conditions",
// //     }),
// //   })
// //   .refine((data) => data.password === data.confirmPassword, {
// //     path: ["confirmPassword"],
// //     message: "Passwords do not match",
// //   });

// // type RegisterData = z.infer<typeof registerSchema>;

// // export default function RegisterForm() {
// //   const [pending, startTransition] = useTransition();

// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors, isSubmitting },
// //   } = useForm<RegisterData>({
// //     resolver: zodResolver(registerSchema),
// //   });

// //   const submit = async (data: RegisterData) => {
// //     startTransition(async () => {
// //       await new Promise((resolve) => setTimeout(resolve, 1000));
// //       console.log("Tutorix Register Data:", data);
// //     });
// //   };

// //   return (
// //     <form onSubmit={handleSubmit(submit)} className="space-y-4">

// //       {/* Full Name */}
// //       <div>
// //         <input
// //           type="text"
// //           placeholder="Full Name"
// //           className="w-full h-11 rounded-md border px-3 text-sm outline-none"
// //           {...register("fullName")}
// //         />
// //         {errors.fullName && (
// //           <p className="text-xs text-red-600">{errors.fullName.message}</p>
// //         )}
// //       </div>

// //       {/* Email */}
// //       <div>
// //         <input
// //           type="email"
// //           placeholder="E-mail"
// //           className="w-full h-11 rounded-md border px-3 text-sm outline-none"
// //           {...register("email")}
// //         />
// //         {errors.email && (
// //           <p className="text-xs text-red-600">{errors.email.message}</p>
// //         )}
// //       </div>

// //       {/* Password */}
// //       <div>
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="w-full h-11 rounded-md border px-3 text-sm outline-none"
// //           {...register("password")}
// //         />
// //         {errors.password && (
// //           <p className="text-xs text-red-600">{errors.password.message}</p>
// //         )}
// //       </div>

// //       {/* Confirm Password */}
// //       <div>
// //         <input
// //           type="password"
// //           placeholder="Confirm Password"
// //           className="w-full h-11 rounded-md border px-3 text-sm outline-none"
// //           {...register("confirmPassword")}
// //         />
// //         {errors.confirmPassword && (
// //           <p className="text-xs text-red-600">
// //             {errors.confirmPassword.message}
// //           </p>
// //         )}
// //       </div>

// //       {/* Terms */}
// //       <div className="flex items-start gap-2 text-sm">
// //         <input type="checkbox" {...register("terms")} />
// //         <span>
// //           I accept all the{" "}
// //           <Link href="#" className="text-blue-600 font-semibold">
// //             terms & conditions
// //           </Link>
// //         </span>
// //       </div>
// //       {errors.terms && (
// //         <p className="text-xs text-red-600">{errors.terms.message}</p>
// //       )}

// //       {/* Register Button */}
// //       <button
// //         type="submit"
// //         disabled={isSubmitting || pending}
// //         className="w-full h-11 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60"
// //       >
// //         {isSubmitting || pending ? "Creating account..." : "Sign Up"}
// //       </button>

// //       {/* Login Link */}
// //       <p className="text-center text-sm">
// //         Already have an account?{" "}
// //         <Link href="/login" className="text-blue-600 font-semibold">
// //           Sign in
// //         </Link>
// //       </p>
// //     </form>
// //   );
// // }


// // 

// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useTransition, useState } from "react";
// // import { Eye, EyeOff } from "lucide-react";
// import { Eye, EyeOff } from "lucide-react";

// const registerSchema = z
//   .object({
//     fullName: z.string().min(2, "Full name is required"),
//     email: z.string().email("Enter a valid email"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6),
//     phoneNumber: z.string().min(10, "Phone number required"),
//     address: z.string().min(3, "Address required"),
//     terms: z.boolean().refine((val) => val === true, {
//       message: "You must accept the terms & conditions",
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// type RegisterData = z.infer<typeof registerSchema>;

// export default function RegisterForm() {
//   const [pending, startTransition] = useTransition();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const submit = async (data: RegisterData) => {
//     startTransition(async () => {
//       console.log("Register Data:", data);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4">

//       {/* Full Name */}
//       <input
//         placeholder="Full Name"
//         className="w-full h-11 rounded-md border px-3 text-sm"
//         {...register("fullName")}
//       />
//       <p className="text-xs text-red-600">{errors.fullName?.message}</p>

//       {/* Email */}
//       <input
//         placeholder="Email"
//         className="w-full h-11 rounded-md border px-3 text-sm"
//         {...register("email")}
//       />
//       <p className="text-xs text-red-600">{errors.email?.message}</p>

//       {/* Password */}
//       <div className="relative">
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Password"
//           className="w-full h-11 rounded-md border px-3 pr-10 text-sm"
//           {...register("password")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-3 text-gray-500"
//         >
//           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </div>
//       <p className="text-xs text-red-600">{errors.password?.message}</p>

//       {/* Confirm Password */}
//       <div className="relative">
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           placeholder="Confirm Password"
//           className="w-full h-11 rounded-md border px-3 pr-10 text-sm"
//           {...register("confirmPassword")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           className="absolute right-3 top-3 text-gray-500"
//         >
//           {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </div>
//       <p className="text-xs text-red-600">{errors.confirmPassword?.message}</p>

//       {/* Phone */}
//       <input
//         placeholder="Phone Number"
//         className="w-full h-11 rounded-md border px-3 text-sm"
//         {...register("phoneNumber")}
//       />
//       <p className="text-xs text-red-600">{errors.phoneNumber?.message}</p>

//       {/* Address */}
//       <input
//         placeholder="Address"
//         className="w-full h-11 rounded-md border px-3 text-sm"
//         {...register("address")}
//       />
//       <p className="text-xs text-red-600">{errors.address?.message}</p>

//       {/* Terms */}
//       <div className="flex gap-2">
//         <input type="checkbox" {...register("terms")} />
//         <span>I accept Terms & Conditions</span>
//       </div>
//       <p className="text-xs text-red-600">{errors.terms?.message}</p>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isSubmitting || pending}
//         className="w-full h-11 bg-green-700 text-white rounded-md"
//       >
//         {pending ? "Creating account..." : "Sign Up"}
//       </button>

//       {/* Login Link */}
//       <p className="text-center text-sm">
//         Already have an account?{" "}
//         <Link href="/login" className="text-blue-600 font-semibold">
//           Sign in
//         </Link>
//       </p>

//     </form>
//   );
// }


// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useTransition, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// const registerSchema = z
//   .object({
//     fullName: z.string().min(2, "Full name is required"),
//     email: z.string().email("Enter a valid email"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6),
//     phoneNumber: z.string().min(10, "Phone number required"),
//     address: z.string().min(3, "Address required"),
//     terms: z.boolean().refine((val) => val === true, {
//       message: "You must accept the terms & conditions",
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// type RegisterData = z.infer<typeof registerSchema>;

// export default function RegisterForm() {
//   const [pending, startTransition] = useTransition();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const submit = async (data: RegisterData) => {
//     startTransition(async () => {
//       console.log("Register Data:", data);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     });
//   };

//   // consistent spacing for all fields
//   const fieldClass =
//     "w-full h-11 rounded-md border px-3 text-sm outline-none mb-4";

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4 max-w-md mx-auto">

//       {/* Full Name */}
//       <input placeholder="Full Name" className={fieldClass} {...register("fullName")} />
//       <p className="text-xs text-red-600">{errors.fullName?.message}</p>

//       {/* Email */}
//       <input placeholder="Email" className={fieldClass} {...register("email")} />
//       <p className="text-xs text-red-600">{errors.email?.message}</p>

//       {/* Password */}
//       <div className="relative mb-4">
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Password"
//           className="w-full h-11 rounded-md border px-3 pr-10 text-sm outline-none"
//           {...register("password")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//         >
//           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </div>
//       <p className="text-xs text-red-600">{errors.password?.message}</p>

//       {/* Confirm Password */}
//       <div className="relative mb-4">
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           placeholder="Confirm Password"
//           className="w-full h-11 rounded-md border px-3 pr-10 text-sm outline-none"
//           {...register("confirmPassword")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//         >
//           {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       </div>
//       <p className="text-xs text-red-600">{errors.confirmPassword?.message}</p>

//       {/* Phone Number */}
//       <input placeholder="Phone Number" className={fieldClass} {...register("phoneNumber")} />
//       <p className="text-xs text-red-600">{errors.phoneNumber?.message}</p>

//       {/* Address */}
//       <input placeholder="Address" className={fieldClass} {...register("address")} />
//       <p className="text-xs text-red-600">{errors.address?.message}</p>

//       {/* Terms */}
//       <div className="flex items-center gap-2 mb-4">
//         <input type="checkbox" {...register("terms")} />
//         <span>I accept Terms & Conditions</span>
//       </div>
//       <p className="text-xs text-red-600">{errors.terms?.message}</p>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isSubmitting || pending}
//         className="w-full h-11 bg-green-700 text-white rounded-md"
//       >
//         {pending ? "Creating account..." : "Sign Up"}
//       </button>

//       {/* Login Link */}
//       <p className="text-center text-sm mt-2">
//         Already have an account?{" "}
//         <Link href="/login" className="text-blue-600 font-semibold">
//           Sign in
//         </Link>
//       </p>
//     </form>
//   );
// }


// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useTransition, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// const registerSchema = z
//   .object({
//     fullName: z.string().min(2, "Full name is required"),
//     email: z.string().email("Enter a valid email"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6),
//     phoneNumber: z.string().min(10, "Phone number required"),
//     address: z.string().min(3, "Address required"),
//     terms: z.boolean().refine((val) => val === true, {
//       message: "You must accept the terms & conditions",
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// type RegisterData = z.infer<typeof registerSchema>;

// export default function RegisterForm() {
//   const [pending, startTransition] = useTransition();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const submit = async (data: RegisterData) => {
//     startTransition(async () => {
//       console.log("Register Data:", data);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     });
//   };

//   // Use this for consistent input styling
//   const inputClass = "w-full h-11 rounded-md border px-3 pr-10 text-sm outline-none";

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-0 max-w-md mx-auto">

//       {/* Full Name */}
//       <div className="mb-4">
//         <input placeholder="Full Name" className="w-full h-11 rounded-md border px-3 text-sm outline-none" {...register("fullName")} />
//         <p className="text-xs text-red-600">{errors.fullName?.message}</p>
//       </div>

//       {/* Email */}
//       <div className="mb-4">
//         <input placeholder="Email" className="w-full h-11 rounded-md border px-3 text-sm outline-none" {...register("email")} />
//         <p className="text-xs text-red-600">{errors.email?.message}</p>
//       </div>

//       {/* Password */}
//       <div className="relative mb-4">
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Password"
//           className={inputClass}
//           {...register("password")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//         >
//           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//         <p className="text-xs text-red-600">{errors.password?.message}</p>
//       </div>

//       {/* Confirm Password */}
//       <div className="relative mb-4">
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           placeholder="Confirm Password"
//           className={inputClass}
//           {...register("confirmPassword")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//         >
//           {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//         <p className="text-xs text-red-600">{errors.confirmPassword?.message}</p>
//       </div>

//       {/* Phone Number */}
//       <div className="mb-4">
//         <input placeholder="Phone Number" className="w-full h-11 rounded-md border px-3 text-sm outline-none" {...register("phoneNumber")} />
//         <p className="text-xs text-red-600">{errors.phoneNumber?.message}</p>
//       </div>

//       {/* Address */}
//       <div className="mb-4">
//         <input placeholder="Address" className="w-full h-11 rounded-md border px-3 text-sm outline-none" {...register("address")} />
//         <p className="text-xs text-red-600">{errors.address?.message}</p>
//       </div>

//       {/* Terms */}
//       <div className="flex items-center gap-2 mb-4">
//         <input type="checkbox" {...register("terms")} />
//         <span>I accept Terms & Conditions</span>
//       </div>
//       <p className="text-xs text-red-600">{errors.terms?.message}</p>

//       {/* Submit */}
//       <div className="mb-4">
//         <button
//           type="submit"
//           disabled={isSubmitting || pending}
//           className="w-full h-11 bg-green-700 text-white rounded-md"
//         >
//           {pending ? "Creating account..." : "Sign Up"}
//         </button>
//       </div>

//       {/* Login Link */}
//       <p className="text-center text-sm mt-2">
//         Already have an account?{" "}
//         <Link href="/login" className="text-blue-600 font-semibold">
//           Sign in
//         </Link>
//       </p>

//     </form>
//   );
// }


// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useTransition, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";

// const router = useRouter(); 


// const registerSchema = z
//   .object({
//     fullName: z.string().min(2, "Full name is required"),
//     email: z.string().email("Enter a valid email"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().min(6),
//     phoneNumber: z.string().min(10, "Phone number required"),
//     address: z.string().min(3, "Address required"),
//     terms: z.boolean().refine((val) => val === true, {
//       message: "You must accept the terms & conditions",
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// type RegisterData = z.infer<typeof registerSchema>;

// export default function RegisterForm() {
//   const [pending, startTransition] = useTransition();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const submit = async (data: RegisterData) => {
//     startTransition(async () => {
//       console.log("Register Data:", data);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     });
//   };

// //   const submit = async (data: RegisterData) => {
// //   startTransition(async () => {
// //     try {
// //       const res = await fetch("http://localhost:5050/api/auth/register", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           fullName: data.fullName,
// //           email: data.email,
// //           username: data.email.split("@")[0], // auto username
// //           password: data.password,
// //           confirmPassword: data.confirmPassword,
// //           phoneNumber: data.phoneNumber,
// //           address: data.address,
// //           profileImage: "", // optional for web
// //         }),
// //       });

// //       const result = await res.json();

// //       if (!res.ok) {
// //         alert(result.message || "Registration failed");
// //         return;
// //       }

// //       alert("Registration successful!");
// //       router.push("/login");
// //     } catch (err) {
// //       console.error(err);
// //       alert("Something went wrong");
// //     }
// //   });
// // };


//   // unified input styling
//   const inputClass = "w-full h-11 rounded-md border px-3 pr-10 text-sm outline-none";

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4 max-w-md mx-auto">

//       {/* Full Name */}
//       <div>
//         <input placeholder="Full Name" className={inputClass} {...register("fullName")} />
//         <p className="text-xs text-red-600">{errors.fullName?.message}</p>
//       </div>

//       {/* Email */}
//       <div>
//         <input placeholder="Email" className={inputClass} {...register("email")} />
//         <p className="text-xs text-red-600">{errors.email?.message}</p>
//       </div>

//       {/* Password */}
//       <div className="relative">
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Password"
//           className={inputClass}
//           {...register("password")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 p-1"
//         >
//           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//         </button>
//         <p className="text-xs text-red-600">{errors.password?.message}</p>
//       </div>

//       {/* Confirm Password */}
//       <div className="relative">
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           placeholder="Confirm Password"
//           className={inputClass}
//           {...register("confirmPassword")}
//         />
//         <button
//           type="button"
//           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 p-1"
//         >
//           {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//         </button>
//         <p className="text-xs text-red-600">{errors.confirmPassword?.message}</p>
//       </div>

//       {/* Phone Number */}
//       <div>
//         <input placeholder="Phone Number" className={inputClass} {...register("phoneNumber")} />
//         <p className="text-xs text-red-600">{errors.phoneNumber?.message}</p>
//       </div>

//       {/* Address */}
//       <div>
//         <input placeholder="Address" className={inputClass} {...register("address")} />
//         <p className="text-xs text-red-600">{errors.address?.message}</p>
//       </div>

//       {/* Terms */}
//       <div className="flex items-center gap-2">
//         <input type="checkbox" {...register("terms")} />
//         <span>I accept Terms & Conditions</span>
//       </div>
//       <p className="text-xs text-red-600">{errors.terms?.message}</p>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isSubmitting || pending}
//         className="w-full h-11 bg-green-700 text-white rounded-md mt-2"
//       >
//         {pending ? "Creating account..." : "Sign Up"}
//       </button>

//       {/* Login Link */}
//       <p className="text-center text-sm mt-2">
//         Already have an account?{" "}
//         <Link href="/login" className="text-blue-600 font-semibold">
//           Sign in
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
import { useTransition, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";

/* ------------------ ZOD SCHEMA ------------------ */
export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
    phoneNumber: z.string().min(10, "Phone number required"),
    address: z.string().min(3, "Address required"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms & conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterData = z.infer<typeof registerSchema>;

/* ------------------ COMPONENT ------------------ */
export default function RegisterForm() {
  const router = useRouter(); // ✅ CORRECT PLACE
  // const [pending, startTransition] = useTransition();
      const [pending, setTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  /* ------------------ SUBMIT ------------------ */
  // const submit = async (data: RegisterData) => {
  //   startTransition(async () => {
  //     try {
  //       const res = await fetch("http://localhost:5050/api/auth/register", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           fullName: data.fullName,
  //           email: data.email,
  //           username: data.email.split("@")[0], // auto username
  //           password: data.password,
  //           confirmPassword: data.confirmPassword,
  //           phoneNumber: data.phoneNumber,
  //           address: data.address,
  //           profileImage: "", // optional (Flutter only)
  //         }),
  //       });

  //       const result = await res.json();

  //       if (!res.ok) {
  //         alert(result.message || "Registration failed");
  //         return;
  //       }

  //       alert("Registration successful!");
  //       router.push("/login"); // ✅ works now
  //     } catch (error) {
  //       console.error(error);
  //       alert("Something went wrong");
  //     }
  //   });
  // };

  const onSubmit = async (data: RegisterData) => {
  setError("");

  setTransition(async () => {
    try {
      const res = await handleRegister({
        // fullname : data.fullname,
        // email: data.email,
        // username: data.username,
        // // firstName: data.firstName,
        // // lastName: data.lastName,
        // password: data.password,
        // confirmPassword: data.confirmPassword,
        // address: data.address,

        fullName: data.fullName,
          email: data.email,
          username: data.email.split("@")[0], // auto username
          password: data.password,
          confirmPassword: data.confirmPassword,
          phoneNumber: data.phoneNumber,
          address: data.address,
          profileImage: "", // optional for web
      });

      if (!res.success) {
        throw new Error(res.message || "Registration failed");
      }
       // handle redirect (optional)
            setTransition(() => {
                router.push("/login");
            });

      // ✅ success
      // router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  });
};


  const inputClass =
    "w-full h-11 rounded-md border px-3 pr-10 text-sm outline-none";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      {/* Full Name */}
      <div>
        <input
          placeholder="Full Name"
          className={inputClass}
          {...register("fullName")}
        />
        <p className="text-xs text-red-600">{errors.fullName?.message}</p>
      </div>

      {/* Email */}
      <div>
        <input
          placeholder="Email"
          className={inputClass}
          {...register("email")}
        />
        <p className="text-xs text-red-600">{errors.email?.message}</p>
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className={inputClass}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <p className="text-xs text-red-600">{errors.password?.message}</p>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className={inputClass}
          {...register("confirmPassword")}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <p className="text-xs text-red-600">
          {errors.confirmPassword?.message}
        </p>
      </div>

      {/* Phone */}
      <div>
        <input
          placeholder="Phone Number"
          className={inputClass}
          {...register("phoneNumber")}
        />
        <p className="text-xs text-red-600">
          {errors.phoneNumber?.message}
        </p>
      </div>

      {/* Address */}
      <div>
        <input
          placeholder="Address"
          className={inputClass}
          {...register("address")}
        />
        <p className="text-xs text-red-600">{errors.address?.message}</p>
      </div>

      {/* Terms */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("terms")} />
        <span>I accept Terms & Conditions</span>
      </div>
      <p className="text-xs text-red-600">{errors.terms?.message}</p>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full h-11 bg-green-700 text-white rounded-md"
      >
        {pending ? "Creating account..." : "Sign Up"}
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
