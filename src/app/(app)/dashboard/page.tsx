'use client'

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/models/message.model';
import { acceptMessagesSchema } from '@/schemas/acceptMessage.schema';
import { apiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const Dashboard = () => {

    const[messages, setMessages] = useState<Message[]>([]);

    const[isLoading, setIsLoading] = useState<boolean>(false);

    const[isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

    const { toast } = useToast();

    const handleDelete = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    }

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
        defaultValues: { acceptMessages: false }
    });

    const { register, watch, setValue } = form;

    const acceptMessages = watch('acceptMessages');

    const fetchAcceptingMessages = useCallback(async() => {
        setIsSwitchLoading(true);

        try {
            const response = await axios.get<apiResponse>("/api/accept-messages")

            setValue("acceptMessages", response.data.isAcceptingMessages || false);
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Oops!!",
                description: axiosError.response?.data.message || "Failed to fetch message settings.",
                variant: "destructive"
            })
        }
        finally {
            setIsSwitchLoading(false);
        }

    }, [setValue]);

    const fetchMessages = useCallback(async(refresh: boolean = false) => {
        try {
            setIsLoading(true);
            setIsSwitchLoading(false);

            const response = await axios.get<apiResponse>("/api/get-messages");

            setMessages(response.data.messages || []);

            if(refresh){
                toast({
                    title: "Refreshed!!",
                    description: "Showing latest messages."
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Oops!!",
                description: axiosError.response?.data.message || "Failed to fetch messages.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if(!session || !session.user){
            return
        }
        fetchMessages();
        fetchAcceptingMessages();
    }, [session, setValue, fetchAcceptingMessages, fetchMessages]);

    const handleSwitcher = async() => {
        try {
            setIsSwitchLoading(true);

            const response = axios.post<apiResponse>("/api/accept-messages", {
                acceptMessages: !acceptMessages
            });

            setValue('acceptMessages', !acceptMessages);

            toast({
                title: acceptMessages ? "Accepting Messages" : "Not accepting messages",
                description: "Message settings changed successfully."
            })
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Oops!!",
                description: axiosError.response?.data.message || "Failed to change message settings.",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false);
        }
    }

    const { username } = session?.user as User;

    const baseUrl = `${window.location.protocol}//${window.location.host}` //TODO: Research about how to find base url

    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(profileUrl);

        toast({
            title: "Copied!",
            description: "Profile url copied successfully."
        })
    }

    if(!session || !session.user){
        return <div> Please login...</div>;
    }

    return (
        <div
            className='
                my-8
                mx-4
                md:mx-8
                lg:mx-auto
                p-6
                bg-white
                rounded
                w-full
                max-w-6xl
            '
        >
            <h1
                className='
                    text-4xl
                    font-bold
                    mb-4
                '
            >
                User Dashboard
            </h1>
            <div 
                className="mb-4"
            >
                <h2
                    className='
                        text-lg
                        font-semibold
                        mb-2
                    '
                >
                    Copy your unique link
                </h2>{' '}
                <div className="flex items-center">
                    <input 
                        type="text"
                        value={profileUrl}
                        disabled
                        className='
                            input 
                            input-bordered
                            w-full
                            p-2
                            mr-2
                        '
                    />
                    <Button
                        onClick={copyToClipBoard}
                    >
                        Copy
                    </Button>
                </div>
            </div>
            <div className="mb-4">
                <Switch 
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitcher}
                    disabled={isSwitchLoading}
                />
                <span className='ml-2'>
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Separator />
            <Button
                className='
                    mt-4
                '
                variant={'outline'}
                onClick={(e) =>{
                    e.preventDefault();
                    fetchMessages(true)
                }}
            >
                {
                    isLoading ? (
                        <Loader2 
                            className='
                                h-4
                                w-4
                                animate-spin
                            '
                        />
                    ) : (
                        <RefreshCcw 
                            className='
                                h-4
                                w-4
                            '
                        />
                    )
                }
            </Button>
            <div
                className='
                    mt-4
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                '
            >
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard 
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDelete}
                            
                        />
                    ))
                ) : (
                    <p
                        className='
                            text-center
                            text-gray-500
                            text-lg
                        '
                    >
                        No messages to display.
                    </p>
                )}
            </div>
        </div>
    )
}

export default Dashboard;