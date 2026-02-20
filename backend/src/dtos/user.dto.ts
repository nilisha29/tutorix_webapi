import z from "zod";
import { UserSchema } from "../types/user.type";
// re-use UserSchema from types

const parseStringArray = (value: unknown, separator: RegExp) => {
    console.log("[parseStringArray] Input:", { value, type: typeof value, isArray: Array.isArray(value) });
    
    if (!value) return [];
    if (Array.isArray(value)) {
        console.log("[parseStringArray] Already array, returning:", value);
        return value;
    }
    if (typeof value === "string") {
        const result = value
            .split(separator)
            .map((item) => item.trim())
            .filter(Boolean);
        console.log("[parseStringArray] Converted string to array:", result);
        return result;
    }
    console.log("[parseStringArray] Unknown type, returning empty array");
    return [];
};

const parseJsonArray = (value: unknown) => {
    console.log("[parseJsonArray] Input:", { value, type: typeof value });
    
    if (!value) return undefined;
    if (Array.isArray(value)) {
        console.log("[parseJsonArray] Already array, returning:", value);
        return value;
    }
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                console.log("[parseJsonArray] Parsed JSON array:", parsed);
                return parsed;
            }
        } catch (error) {
            console.log("[parseJsonArray] JSON parse failed:", error);
        }
    }
    console.log("[parseJsonArray] Returning undefined");
    return undefined;
};

const parseEducationArray = (value: unknown) => {
    console.log("[parseEducationArray] Input:", { value, type: typeof value });
    
    if (!value) return [];
    if (Array.isArray(value)) {
        console.log("[parseEducationArray] Already array, returning:", value);
        return value;
    }
    if (typeof value === "string") {
        const lines = value
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
        console.log("[parseEducationArray] Converted to array:", lines);
        return lines.length ? lines : [];
    }
    console.log("[parseEducationArray] Returning empty array");
    return [];
};

export const CreateUserDTO = UserSchema.pick(
    {
        // firstName: true,
        // lastName: true,
        fullName: true,
        email: true,
        username: true,
        password: true
    }
).extend( // add new attribute to zod
    {
        confirmPassword: z.string().min(6),
        phoneNumber: z.string().optional(),
        address: z.string().optional(),
        profileImage: z.string().optional(),
        role: z.enum(["admin", "user", "tutor"]).optional(),
        subject: z.string().optional(),
        gradeLevel: z.string().optional(),
        pricePerHour: z.coerce.number().min(0).optional(),
        rating: z.coerce.number().min(0).max(5).optional(),
        reviewsCount: z.coerce.number().min(0).optional(),
        about: z.string().optional(),
        experienceYears: z.coerce.number().min(0).optional(),
        responseTime: z.string().optional(),
        languages: z.preprocess((value) => parseStringArray(value, /,/), z.array(z.string()).optional()),
        tags: z.preprocess((value) => parseStringArray(value, /,/), z.array(z.string()).optional()),
        education: z.preprocess((value) => parseEducationArray(value), z.array(z.string()).optional()),
        availabilitySlots: z.preprocess(
            (value) => parseJsonArray(value),
            z.array(
                z.object({
                    day: z.string(),
                    times: z.array(z.string()),
                })
            ).optional()
        ),
        reviews: z.preprocess(
            (value) => parseJsonArray(value),
            z.array(
                z.object({
                    name: z.string(),
                    detail: z.string(),
                    quote: z.string(),
                })
            ).optional()
        ),
    }
).refine( // extra validation for confirmPassword
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }
)
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;


export const UpdateUserDto = UserSchema.partial(); // all optional fields
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

// =========================
// BECOME TUTOR DTO (flexible validation - service handles conversion)
// =========================
export const BecomeTutorDTO = z.object({
  about: z.string().optional(),
  experienceYears: z.coerce.number().min(0).optional(),
  responseTime: z.string().optional(),
  languages: z.string().or(z.array(z.string())).optional(),
  tags: z.string().or(z.array(z.string())).optional(),
  education: z.string().or(z.array(z.string())).optional(),
  availabilitySlots: z.string().or(z.array(z.any())).optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  pricePerHour: z.coerce.number().min(0).optional(),
});

export type BecomeTutorDTO = z.infer<typeof BecomeTutorDTO>;

export const AddTutorReviewDTO = z.object({
    quote: z.string().min(3),
    rating: z.coerce.number().min(1).max(5),
});

export type AddTutorReviewDTO = z.infer<typeof AddTutorReviewDTO>;