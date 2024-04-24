import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";

export async function POST(req: NextRequest){

    await dbConnect();

    try {

        const { username, code } =  await req.json();

        if(!username || !code){
            return NextResponse.json(
                {
                    success: false,
                    message: "Please fill all the values required!!"
                },
                {
                    status: 400,
                }
            )
        }

        const user = await UserModel.findOne(
            {
                username,
            }
        )

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found!!"
                },
                {
                    status: 400
                }
            )
        }

        const isCodeValid = user.verifyCode === code;

        const isCodeNotExpired = user.verifyCodeExpiry > new Date(Date.now());

        if(!isCodeValid && !isCodeNotExpired){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not verified!! Invalid verification code!!Please sign up again to get a new code."
                },
                {
                    status: 400
                }
            )
        }else if(!isCodeValid && isCodeNotExpired){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not verified!! Verification code incorrect!!"
                },
                {
                    status: 400
                }
            )
        }else if(isCodeValid && !isCodeNotExpired){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not verified!!  Verification code expired!! Please sign up again to get a new code."
                },
                {
                    status: 400
                }
            )
        }

        user.isVerified = true;

        return NextResponse.json(
            {
                success: true,
                message: "User verified successfully!!"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error while verifying the user!!",error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while verifying the user!!"
            },
            {
                status: 500
            }
        )
    }
}
