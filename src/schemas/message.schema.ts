import { z } from "zod";


export const messageValidationSchema = z.object({
    content: z.string().min(5, "Message should be at least 10 words!!").max(250, "Message length cannot be more than 200 words!!")
})