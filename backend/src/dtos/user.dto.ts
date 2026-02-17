import z from "zod";
import { UserSchema } from "../types/user.type";
// re-use UserSchema from types
const parseStringArray = (value: unknown, separator: RegExp) => {
    if (typeof value !== "string") return value;
    return value
        .split(separator)
        .map((item) => item.trim())
        .filter(Boolean);
};

const parseJsonArray = (value: unknown) => {
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const parseEducationArray = (value: unknown) => {
    if (typeof value !== "string") return value;
    const lines = value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
    return lines.length ? lines : value;
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