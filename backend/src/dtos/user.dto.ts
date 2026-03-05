import z from "zod";
import { UserSchema } from "../types/user.type";
// re-use UserSchema from types

const parseStringArray = (value: unknown, separator: RegExp) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        const result = value
            .split(separator)
            .map((item) => item.trim())
            .filter(Boolean);
        return result;
    }
    return [];
};

const parseJsonArray = (value: unknown) => {
    if (!value) return undefined;
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
        }
    }
    return undefined;
};

const parseEducationArray = (value: unknown) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        const lines = value
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
        return lines.length ? lines : [];
    }
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


export const UpdateUserDto = z.object({
    fullName: z.string().min(3).optional(),
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.string().optional(),
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
                reviewerId: z.string().optional(),
                name: z.string(),
                detail: z.string(),
                profileImage: z.string().optional(),
                quote: z.string(),
                rating: z.coerce.number().min(1).max(5).optional(),
            })
        ).optional()
    ),
    role: z.enum(["admin", "user", "tutor"]).optional(),
    tutorOrigin: z.enum(["admin", "self"]).optional(),
});
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