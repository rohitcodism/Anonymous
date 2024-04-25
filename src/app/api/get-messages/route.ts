import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";



export async function POST(req: NextRequest){
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        const user = session?.user;

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

        const userId = new mongoose.Types.ObjectId(user._id);

        const foundUser = await UserModel.aggregate(
            [
                {
                    $match: {
                        _id: userId
                    }
                },
                {
                    $unwind: '$messages'
                },
                {
                    $sort: {
                        'messages.createdAt': -1
                    }
                },
                {
                    $group:{
                        _id: '$_id',
                        messages: {
                            $push: '$messages'
                        }
                    }
                }
            ]
        )

        if(!foundUser || foundUser.length === 0){
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

        return NextResponse.json(
            {
                success: true,
                messages: foundUser[0].messages
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error while getting messages : ",error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while getting messages : "
            },
            {
                status: 500
            }
        )
    }
}