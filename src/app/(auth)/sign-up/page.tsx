'use client'

import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signup.schema';
import axios, { AxiosError } from 'axios';
import { apiResponse } from '@/types/apiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const SignUp = () => {

    const [username, setUsername] = useState<string>("");

    const [usernameMessage, setUsernameMessage] = useState<string>("");

    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const debounced = useDebounceCallback(setUsername, 500);

    const { toast } = useToast();

    const router = useRouter();

    //* Zod Implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if (username) {
                setIsCheckingUsername(true);

                setUsernameMessage("");

                try {

                    const res = await axios.get(`/api/unique-username/?username=${username}`)

                    setUsernameMessage(res.data.message);

                } catch (error) {

                    const axiosError = error as AxiosError<apiResponse>; //* Try to study it more *//

                    setUsernameMessage(axiosError.response?.data.message || "Error checking username!!")
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUniqueUsername();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);

        try {

            console.log("Data from the form  : ", data);

            const res = await axios.post<apiResponse>('/api/signup', data);

            toast({
                title: 'Success',
                description: res.data.message
            });

            router.replace(`/verify/${username}`);
        } catch (error) {
            console.log("Error in sign up the user!!", error);
            const axiosError = error as AxiosError<apiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Sign up failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
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
                className="
                    w-full
                    max-w-md
                    p-8
                    space-y-8
                    bg-white
                    rounded-lg
                    shadow-md
                "
            >
                <div
                    className='
                        text-center
                    '
                >
                    <h1
                        className='
                            text-4xl
                            font-extrabold
                            tracking-tight
                            lg:text-5xl
                            mb-6
                        '
                    >
                        Join Anonymous
                    </h1>
                    <p
                        className='
                            mb-4
                        '
                    >
                        Sign up to start anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='
                            space-y-8
                        '
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='username'
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className='animate-spin' />}
                                    <p
                                        className={`text-sm ${usernameMessage === "Username is available!!" ? 'text-green-500' : 'text-red-500'} font-medium`}
                                    >
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='user@example.com'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                        >
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 
                                            className='
                                                mr-2
                                                w-4
                                                h-4
                                                animate-spin
                                            '
                                        /> 
                                        Please wait
                                    </>
                                ) : ('Sign up')
                            }
                        </Button>
                    </form>
                </Form>
                <div
                    className='
                        text-center
                        mt-4
                    '
                >
                    <p>
                        Already a member?{''}
                        <Link
                            href={'/sign-in'}
                            className='
                                hover:text-black
                                text-gray-600
                                px-3
                            '
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp;