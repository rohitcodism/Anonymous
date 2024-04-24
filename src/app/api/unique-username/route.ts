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
        console.log(result);

        if(!result){
            // check the result variable for error now sending a manual error
            return NextResponse.json(
                {
                    success: false,
                    message: "Username can only contain small alphabets and numeric values!!"
                },{
                    status: 400
                }
            )
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