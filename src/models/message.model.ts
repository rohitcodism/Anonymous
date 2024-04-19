import mongoose, {Schema, Document, SchemaType} from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt: Date,
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model("Message", messageSchema));

export default MessageModel;