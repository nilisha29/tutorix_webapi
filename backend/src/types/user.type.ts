import z from 'zod';

export const UserSchema = z.object({
    fullName: z.string().min(3),
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.string().url().optional(),
    // firstName: z.string().optional(),
    // lastName: z.string().optional(),
    role: z.enum(['admin', 'user']).default('user'),
});

export type UserType = z.infer<typeof UserSchema>;