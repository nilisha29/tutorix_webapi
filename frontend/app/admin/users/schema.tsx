import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const UserSchema = z.object({
    fullName: z.string().min(2, { message: "Full name is required" }),
    email: z.email({ message: "Enter a valid email" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    subject: z.string().optional(),
    gradeLevel: z.string().optional(),
    pricePerHour: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.coerce.number().min(0)
    ).optional(),
    rating: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.coerce.number().min(0).max(5)
    ).optional(),
    reviewsCount: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.coerce.number().min(0)
    ).optional(),
    about: z.string().optional(),
    experienceYears: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.coerce.number().min(0)
    ).optional(),
    responseTime: z.string().optional(),
    languages: z.string().optional(),
    tags: z.string().optional(),
    education: z.string().optional(),
    availabilitySlots: z.string().optional(),
    reviews: z.string().optional(),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
}).refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export type UserData = z.infer<typeof UserSchema>;

export const UserEditSchema = UserSchema.partial()
export type UserEditData = z.infer<typeof UserEditSchema>;