import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<apiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev>',
            to: email,
            subject: 'Anonymous | User Verification Code',
            react: VerificationEmail({ username: username, otp: verificationCode }),
        });

        return {
            success: true,
            message: "Verification email send successfully!!"
        }

    } catch (error) {
        console.log("Verification Email Sender error!!", error);
        return {
            success: false,
            message: "Failed to send verification email!!"
        }
    }
}