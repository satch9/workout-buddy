import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { SigninValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loader from './../../components/ui/shared/Loader';
import { useSignInAccount } from "@/lib/react-query/queries";
import { useToast } from "@/components/ui/use-toast"
import { useWorkerContext } from '@/context/AuthContext';


const SigninForm = () => {
    const { toast } = useToast();
    const { checkAuthWorker, isLoading: isWorkerLoading } = useWorkerContext();
    const navigate = useNavigate()


    const {
        mutateAsync: signInAccount,
    } = useSignInAccount();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        console.log("signin values", values)

        const session = await signInAccount({
            email: values.email,
            password: values.password
        })

        if (!session) {
            return toast({
                title: "Echec de connexion. Merci d'essayer à nouveau"
            })
        }
        console.log('session', session)

        const isLoggedIn = await checkAuthWorker();

        if (isLoggedIn) {
            form.reset();
            navigate('/');
        } else {
            return toast({
                title: "Votre inscription a échoué. Merci d'essayer à nouveau"
            })
        }
    }

    return (
        <Form {...form}>
            <div className=" sm:w-420 flex-center flex-col">
                <img
                    src="../../../public/assets/images/logo.jpg"
                    alt="logo"
                    width={64}
                    height={64}
                    className='rounded-full'
                />
                <h2 className="h3-bold md:h2-bold pt-2 sm:pt-8">Workout</h2>
                <h2 className="base-medium pt-2 sm:pt-8">Se connecter à votre compte</h2>
                <p className="text-light-3 pt-2 small-medium md:base-regular">
                    Bienvenue à nouveau! Entrez vos informations
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 w-full mt-4"
                >

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
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
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isWorkerLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Chargement...
                            </div>
                        ) : (
                            "Soumettre"
                        )}
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Pas de compte ?
                        <Link
                            to="/sign-up"
                            className="text-primary-500 text-small-semibold ml-1"
                        >
                            S'enregistrer
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SigninForm

