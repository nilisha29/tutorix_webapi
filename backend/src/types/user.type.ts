import z from 'zod';

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
    languages: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    education: z.array(z.string()).optional(),
    availabilitySlots: z.array(
        z.object({
            day: z.string(),
            times: z.array(z.string()),
        })
    ).optional(),
    reviews: z.array(
        z.object({
            name: z.string(),
            detail: z.string(),
            quote: z.string(),
        })
    ).optional(),
    // firstName: z.string().optional(),
    // lastName: z.string().optional(),
    role: z.enum(['admin', 'user', 'tutor']).default('user'),
});

export type UserType = z.infer<typeof UserSchema>;