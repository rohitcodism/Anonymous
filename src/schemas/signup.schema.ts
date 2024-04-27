import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(3, "Username must be of at least three characters!!")
    .max(8, "Username can't be more than 8 characters!!")
    .regex(/^[a-z0-9_]+$/, "Username cannot contain capital letters or special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address!!"}),
    password: z.string().min(6, "Password must be between 6-12 characters!!").max(12, "Password must be between 6-12 characters!!")
})

