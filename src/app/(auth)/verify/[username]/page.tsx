'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { verifyValidationSchema } from '@/schemas/verify.schema';
import { apiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const VerifyUser = () => {

    const router = useRouter();

    const params = useParams<{ username: string }>();

    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifyValidationSchema>>({
        resolver: zodResolver(verifyValidationSchema),
    });

    const onSubmit = async (data: z.infer<typeof verifyValidationSchema>) => {
        try {
            const res = await axios.post(`/api/verify-user`, {
                username: params.username,
                code: data.code,
            })

            if (res.data.success) {
                toast(
                    {
                        title: "Success",
                        description: `${res.data.message}`,
                        variant: "default"
                    }
                )
            }

            router.replace('/sign-in');
        } catch (error) {

            console.log("Error while verifying the user: ");
            const axiosError = error as AxiosError<apiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Sign up failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <div
            className='
                flex
                justify-center
                items-center
                min-h-screen
                bg-gray-100
            '
        >
            <div
                className='
                    w-full
                    max-w-lg
                    p-8
                    space-y-8
                    bg-white
                    rounded-xl
                    shadow-md
                    flex
                    flex-col
                    items-center
                '
            >
                <div
                    className='
                        text-center
                    '
                >
                    <h1
                        className='
                            text-3xl
                            font-extrabold
                            tracking-tight
                            lg:text-4xl
                            mb-6
                        '
                    >
                        Verify Your Account
                    </h1>
                    <p
                        className='
                            mb-4
                        '
                    >
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 space-y-6 flex flex-col items-center text-center">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-lg'>Verification Code</FormLabel>
                                    <FormControl>
                                        <div
                                            className='pl-6'
                                        >
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Please enter the verification code sent to your email
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyUser;