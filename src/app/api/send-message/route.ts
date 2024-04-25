import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import { Message } from "@/models/message.model";



export async function POST(req: NextRequest){
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
    
        const user = session?.user;

        const userId = session?.user._id;

        if(!session || !user){
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized Request!!"
                },
                {
                    status: 400
                }
            )
        }

        const { message, username } = await req.json();

        const foundUser = await UserModel.findOne({username});

        if(!foundUser){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found!!"
                },
                {
                    status: 404
                }
            )
        }

        if(foundUser.isAcceptingMessage === false){
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not accepting messages right now!!"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = { content: message, createdAt: new Date() }

        foundUser.messages.push(newMessage as Message);

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully!!"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error in sending message: ", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error in sending message!!"
            },
            {
                status: 500
            }
        )
    }
}