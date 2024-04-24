import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";


export async function POST(req: NextRequest){
    await dbConnect();

    try {

        const session = await getServerSession(authOptions);

        const user = session?.user as User;

        const userId = user?._id;

        const currentMessageStatus = user?.isAcceptingMessages;

        const { acceptMessages } = await req.json();

        if(!session || !user){
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized Request!!",
                },
                {
                    status: 401
                }
            )
        }


        if(currentMessageStatus === acceptMessages){
            return NextResponse.json(
                {
                    success: false,
                    message: `Accepting messages option is already set to ${acceptMessages}!!`
                },
                {
                    status: 400,
                }
            )
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if(!updatedUser){
            return NextResponse.json(
                {
                    success: false,
                    message: "Something went wrong while updating the user!!"
                },
                {
                    status: 400
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Successfully!! Updated the user messaging status!!",
                updatedUser
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error while toggling accept messages status : ",error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while toggling accept messages status : "
            },
            {
                status: 500
            }
        )
    }
}