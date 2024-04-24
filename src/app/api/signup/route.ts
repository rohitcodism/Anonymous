import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { hashPassword } from "@/helpers/hashPassword";
import { generateOtp } from "@/helpers/otpGenerator";

export async function POST(req: NextRequest) {

    if(req.method !== 'POST'){
        return NextResponse.json(
            {
                success: false,
                message: "Invalid Method!!"
            },
            {
                status: 405,
            }
        )
    }

    await dbConnect();

    try {

        const reqBody = req.json();

        const { username, email, password } = await reqBody;

        const existingUserWithVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserWithVerifiedUsername) {
            return NextResponse.json(
                {
                    message: "Username is already taken!!",
                    success: false,
                },
                {
                    status: 400,
                }
            )
        }

        const user = await UserModel.findOne({ email: email });

        const verificationCode = generateOtp();

        if (user && user.isVerified) {
            return NextResponse.json(
                {
                    message: "User already exists!! with this verified email.",
                    success: false,
                },
                {
                    status: 400,
                }
            )
        }

        else if(user && !user.isVerified){
            const hashedPassword = await hashPassword(password);

            user.password = hashedPassword,
            user.verifyCode = verificationCode,
            user.verifyCodeExpiry = new Date(Date.now() + 3600000);

            await user.save();
        }

        else {

            const hashedPassword = await hashPassword(password);

            const expiryDate = new Date();

            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verificationCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            const savedUser = await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verificationCode
        )

        console.log("Email Response : ",emailResponse);

        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 400,
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully!! Please verify your email.",
            },
            {
                status: 200
            }
        )
    }
    catch (error) {
        console.log("Something went wrong while registering the user!!", error);
        return NextResponse.json({
            message: "Error!! while registering the user.",
            success: false,
        },
            {
                status: 500
            }
        )
    }
}