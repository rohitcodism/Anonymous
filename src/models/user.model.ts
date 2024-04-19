import mongoose, {Schema, Document, SchemaType} from "mongoose";
import { Message } from "./message.model";

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!!"],
    },
    email: {
        type: String,
        required: [true, "email is required!!"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required!!"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required!!"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"],
        default: Date.now() + 3600000,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Message"
        }]
    }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema));

export default UserModel;