import { Message } from "@/models/message.model"

export interface apiResponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<Message>
}