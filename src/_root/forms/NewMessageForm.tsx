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

const NewMessageForm = () => {

    const { toast } = useToast();

    const { mutateAsync: createMessage, isPending: isLoading} = useAddNewMessage();

    const form = useForm<z.infer<typeof AddNewMessageValidation>>({
        resolver: zodResolver(AddNewMessageValidation),
        defaultValues: {
            body: "",
        },
    });

    const handleAddNewMessage = async (values: z.infer<typeof AddNewMessageValidation>) => {
        //console.log("add new workout values", values)

        const newMessage = await createMessage({
            body: values.body,
        });

        if (!newMessage) {
            toast({ title: "Merci de bien vérifier vos données" });
            return;
        }else{
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