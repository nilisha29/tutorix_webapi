import z from 'zod';

const parseStringArray = (value: unknown, separator: RegExp) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        return value
            .split(separator)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
};

const parseJsonArray = (value: unknown) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
        } catch (error) {
            // continue
        }
    }
    return undefined;
};

const parseEducationArray = (value: unknown) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        const lines = value
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
        return lines.length ? lines : [];
    }
    return [];
};

export const UserSchema = z.object({
    fullName: z.string().min(3),
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.string().url().optional(),
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
    reviews: z.array(
        z.object({
            reviewerId: z.string().optional(),
            name: z.string(),
            detail: z.string(),
            profileImage: z.string().optional(),
            quote: z.string(),
            rating: z.coerce.number().min(1).max(5).optional(),
        })
    ).optional(),
    // firstName: z.string().optional(),
    // lastName: z.string().optional(),
    role: z.enum(['admin', 'user', 'tutor']).default('user'),
    resetPasswordToken: z.string().optional(),
    resetPasswordExpiresAt: z.coerce.date().optional(),
});

export type UserType = z.infer<typeof UserSchema>;