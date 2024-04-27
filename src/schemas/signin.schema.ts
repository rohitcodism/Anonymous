import { z } from "zod";
import { usernameValidation } from "./signup.schema";

export const signInSchema = z.object({
    username: usernameValidation,
    password: z.string()
})