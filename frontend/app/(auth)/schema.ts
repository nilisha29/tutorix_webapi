// import z from "zod";

// export const loginSchema = z.object({
//     email: z.email({ message: "Enter a valid email" }),
//     password: z.string().min(6, { message: "Minimum 6 characters" }),
// });

// export type LoginData = z.infer<typeof loginSchema>;

// export const registerSchema = z.object({
//     firstname: z.string().min(2, { message: "Minimum 2 characters" }),
//     lastname: z.string().min(2, { message: "Minimum 2 characters" }),
//     email: z.email({ message: "Enter a valid email" }),
//     username: z.string().min(3, { message: "Minimum 3 characters" }),
//     password: z.string().min(6, { message: "Minimum 6 characters" }),
//     confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
// }).refine((v) => v.password === v.confirmPassword, {
//         path: ["confirmPassword"],
//         message: "Passwords do not match",
// });

// export type RegisterData = z.infer<typeof registerSchema>;


import { z } from "zod";

/* =========================
   LOGIN SCHEMA
========================= */
export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

/* =========================
   REGISTER SCHEMA
========================= */
export const registerSchema = z
  .object({
    firstname: z.string().min(2, { message: "Minimum 2 characters" }),
    lastname: z.string().min(2, { message: "Minimum 2 characters" }),

    email: z.string().email({ message: "Enter a valid email" }),

    username: z.string().min(3, { message: "Minimum 3 characters" }),

    phoneNumber: z
      .string()
      .min(7, { message: "Enter a valid phone number" }),

    address: z.string().min(3, { message: "Address is required" }),

    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterData = z.infer<typeof registerSchema>;
