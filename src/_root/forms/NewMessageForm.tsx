import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { MdSend } from "react-icons/md";

import { useAddNewMessage } from "@/lib/react-query/queries";
import { AddNewMessageValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import Loader from '@/components/ui/shared/Loader';
import { useWorkerContext } from '@/context/AuthContext';
import { useEffect } from 'react';
import { appwriteConfig, client } from '@/lib/appwrite/config';


const NewMessageForm = ({ incrementUnreadMessages }: { incrementUnreadMessages: () => void }) => {

    const { toast } = useToast();
    const { worker } = useWorkerContext()

    const { mutateAsync: createMessage, isPending: isLoading } = useAddNewMessage();

    const form = useForm<z.infer<typeof AddNewMessageValidation>>({
        resolver: zodResolver(AddNewMessageValidation),
        defaultValues: {
            body: "",
        },
    });

    useEffect(() => {
        const unsubscribe = client.subscribe(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`, response => {
            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log("response newmessageform", response)
                
                incrementUnreadMessages()
            }
        });

        return () => unsubscribe();
    }, [incrementUnreadMessages])

    const handleAddNewMessage = async (values: z.infer<typeof AddNewMessageValidation>) => {
        //console.log("add new workout values", values)

        console.log("worker new Message", worker)
        const newMessage = await createMessage({
            body: values.body,
            user_id: worker.id,
            username: worker.username
        });

        if (!newMessage) {
            toast({ title: "Merci de bien vérifier vos données" });
            return;
        } else {
            form.reset();
            toast({ title: "Message envoyé !" });
            
        }
    }

    return (
        <Form {...form} >
            <div>
                <form
                    onSubmit={form.handleSubmit(handleAddNewMessage)}
                    className="flex flex-col gap-5 w-full mt-4 mb-4"
                >
                    <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea maxLength={1000} placeholder="Ecris quelque chose..." className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary ">
                        {isLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Chargement...
                            </div>
                        ) : (
                            <MdSend />
                        )}
                    </Button>
                </form>
            </div>
        </Form>
    )
}

export default NewMessageForm