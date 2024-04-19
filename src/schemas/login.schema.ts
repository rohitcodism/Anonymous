import { z } from "zod";
import { usernameValidation } from "./signup.schema";

const UsernameOrEmailValidation = z.union([
    usernameValidation,
    z.string().email({ message: 'Invalid email address' })
]);

export const loginValidationSchema = z.object({
    identifier : UsernameOrEmailValidation,
    password: z.string().min(6, "Password must be between 6-12 characters!!").max(12, "Password must be between 6-12 characters!!")
});