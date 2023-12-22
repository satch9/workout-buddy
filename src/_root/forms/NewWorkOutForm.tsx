import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Loader from './../../components/ui/shared/Loader';

import { useAddNewWorkOut } from "@/lib/react-query/queries";
import { AddNewWorkOutValidation } from "@/lib/validation";


const NewWorkOutForm = () => {

    const { toast } = useToast();

    const { mutateAsync: addNewWorkOut, isPending: isLoading} = useAddNewWorkOut();

    //console.log("worker newworkoutform", worker);

    const form = useForm<z.infer<typeof AddNewWorkOutValidation>>({
        resolver: zodResolver(AddNewWorkOutValidation),
        defaultValues: {
            title: "",
            load: 0,
            reps: 0,
            link: ""
        },
    });

    const handleAddNewWorkOut = async (values: z.infer<typeof AddNewWorkOutValidation>) => {
        //console.log("add new workout values", values)

        const newWorkOut = await addNewWorkOut({
            title: values.title,
            load: values.load,
            reps: values.reps,
            link: values.link
        });

        if (!newWorkOut) {
            toast({ title: "Merci de bien vérifier vos données" });
            return;
        }else{
            form.reset();
            toast({ title: "Votre ajout d'un nouvel élément c'est bien passé !" });
        }

        
    }

    return (
        <Form {...form}>
            <div className="p-3">
                <h2 className="h3-bold md:h2-bold ">Ajouter un nouveau workout</h2>
                <p className="text-light-3 pt-2 small-medium md:base-regular">
                    Entrez vos informations
                </p>

                <form
                    onSubmit={form.handleSubmit(handleAddNewWorkOut)}
                    className="flex flex-col gap-5 w-full mt-4"
                >

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre pour l'exercice</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="load"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Charge</FormLabel>
                                <FormControl>
                                    <Input type="number" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reps"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Répétition</FormLabel>
                                <FormControl>
                                    <Input type="number" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lien</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Chargement...
                            </div>
                        ) : (
                            "Ajouter"
                        )}
                    </Button>
                </form>
            </div>
        </Form>
    )

}

export default NewWorkOutForm