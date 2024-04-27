import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { usernameValidation } from '@/schemas/signup.schema';
import { NextRequest, NextResponse } from 'next/server';

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest) {

    await dbConnect();

    try {

        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        //console.logging the result, remove later
        console.log(result.error?.issues[0]);

        const errorCode = result.error?.issues[0].code;

        if(!result.success){
            // check the result variable for error now sending a manual error
            if(result.error?.issues[0].code === "too_small" || result.error?.issues[0].code === "too_big"){
                return NextResponse.json(
                    {
                        success: false,
                        message: `Username should contain ${errorCode === "too_small" ? 'minimum 3 letters' : 'maximum 8 letters'}`
                    },{
                        status: 400
                    }
                )
            }else{
                return NextResponse.json(
                    {
                        success: false,
                        message: "Username cannot contain capital letters or special characters"
                    },{
                        status: 400
                    }
                )
            }
        }

        const existingUsernamedUser = await UserModel.findOne({
            username: queryParam?.username,
            isVerified: true,
        });

        if(existingUsernamedUser){
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken!!"
                },
                {
                    status: 400
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Username is available!!"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error!! checking username", error);
        return NextResponse.json({
            success: false,
            message: "Error checking username!!"
        },
            {
                status: 500
            })
    }
}