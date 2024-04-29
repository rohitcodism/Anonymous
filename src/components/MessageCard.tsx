import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Message } from "@/models/message.model";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { apiResponse } from "@/types/apiResponse";

interface MessageCardProps {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

export const MessageCard = ({
    message,
    onMessageDelete,
}: MessageCardProps) => {


    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        console.log("Delete Confirmed");

        try {
            const res = await axios.delete<apiResponse>(`/api/deleteMessage/${message._id}`);

            if (res.data.success) {
                toast({
                    title: "Message Deleted",
                    description: "Message has been deleted successfully"
                });
            }
        } catch (error) {

            console.log(error);


            toast({
                title: "Error",
                description: "An error occurred while deleting the message"
            });
        }

    }


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><Trash2 className="w-5 h-5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm} >Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
            </Card>
        </div>
    );
}