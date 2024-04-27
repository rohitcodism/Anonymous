import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<apiResponse> {
    try {

        console.log("username : ",username);
        console.log("email : ",email);
        console.log("Verification Code : ",verificationCode);

        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous | User Verification Code',
            react: VerificationEmail({ username: username, otp: verificationCode }),
        });

        console.log("Resend email response own : ",result);

        if(result.data){
            return {
                success: true,
                message: "Verification email send successfully!!"
            }
        }

        return {
            success: false,
            message: "Something went wrong while sending the verification mail!!"
        }

    } catch (error) {
        console.log("Verification Email Sender error!!", error);
        return {
            success: false,
            message: "Failed to send verification email!!"
        }
    }
}