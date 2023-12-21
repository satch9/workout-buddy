import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";


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

import { useSignInAccount } from "@/lib/react-query/queries";
import { useWorkerContext } from '@/context/AuthContext';
import { SigninValidation } from "@/lib/validation";


const SigninForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate()
    const { checkAuthWorker, isLoading: isWorkerLoading } = useWorkerContext();

    const { mutateAsync: signInAccount, isPending: isLoading } = useSignInAccount();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSignin = async (values: z.infer<typeof SigninValidation>) => {
        console.log("signin values", values)

        const session = await signInAccount({
            email: values.email,
            password: values.password
        });

        if (!session) {
            toast({ title: "Echec de connexion. Merci d'essayer à nouveau" });
            return;
        }
        console.log('session', session);

        const isLoggedIn = await checkAuthWorker();

        if (isLoggedIn) {
            form.reset();
            navigate('/');
        } else {
            toast({ title: "Votre inscription a échoué. Merci d'essayer à nouveau" });
            return;
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
                    onSubmit={form.handleSubmit(handleSignin)}
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
                        {isLoading || isWorkerLoading ? (
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

