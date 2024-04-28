'use client'

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { loginValidationSchema } from '@/schemas/login.schema';
import { signIn } from 'next-auth/react';

const SignIn = () => {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { toast } = useToast();

    const router = useRouter();

    //* Zod Implementation
    const form = useForm<z.infer<typeof loginValidationSchema>>({
        resolver: zodResolver(loginValidationSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof loginValidationSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        console.log('Sign in Result : ',result);

        if(result?.error){
            toast({
                title: "Error",
                description: "Incorrect username or password",
                variant: "destructive"
            })
        }else{
            toast({
                title: "Success",
                description: "User log in successful",
            })
        }

        if(result?.url){
            console.log("Inside If block");
            router.replace('/dashboard');
            console.log("Router replaced")
        }
        setIsSubmitting(false);
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
                        Sign in
                    </h1>
                    <p
                        className='
                            mb-4
                        '
                    >
                        Log in to your anonymous account
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
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
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
                                ) : ('Sign in')
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default SignIn;