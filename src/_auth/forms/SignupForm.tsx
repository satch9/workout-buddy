import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { SignupValidation } from "@/lib/validation";
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
import { useCreateWorkerAccount, useSignInAccount } from "@/lib/react-query/queries";
import { useToast } from "@/components/ui/use-toast"
import { useWorkerContext } from '@/context/AuthContext';


const SignupForm = () => {
    const { toast } = useToast();
    const { checkAuthWorker, isLoading: isPlayerLoading } = useWorkerContext();
    const navigate = useNavigate()

    const {
        mutateAsync: createWorkerAccount,
        isPending: isCreatingAccount
    } = useCreateWorkerAccount();

    const {
        mutateAsync: signInAccount,
        isPending: isSigningIn
    } = useSignInAccount();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const handleSignup = async (values: z.infer<typeof SignupValidation>) => {

        try {

            console.log("signup values", values)

            // create new User
            const newUser = createWorkerAccount(values);

            console.log("newUser Signupform", newUser);

            if (!newUser) {
                return toast({
                    title: "Votre inscription a échoué. Merci d'essayer à nouveau"
                })
            }

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
                toast({
                    title: "Vous êtes connecté!"
                })
                navigate('/');
            } else {
                return toast({
                    title: "Votre inscription a échoué. Merci d'essayer à nouveau"
                })
            }

        } catch (error) {
            console.log({ error });
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
                <h2 className="base-medium pt-2 sm:pt-8">Créer un nouveau compte</h2>
                <p className="text-light-3 pt-2 small-medium md:base-regular">
                    Pour commencer, entre les détails
                </p>

                <form
                    onSubmit={form.handleSubmit(handleSignup)}
                    className="flex flex-col gap-5 w-full mt-4"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom d'utilisateur</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
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
                        {isCreatingAccount || isSigningIn || isPlayerLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Chargement...
                            </div>
                        ) : (
                            "Soumettre"
                        )}
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Déjà un compte ?
                        <Link
                            to="/sign-in"
                            className="text-primary-500 text-small-semibold ml-1"
                        >
                            Se connecter
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignupForm
