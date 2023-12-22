import * as z from "zod";

export const SignupValidation = z.object({
    username: z.string().min(2, { message: "Trop court !" }),
    email: z.string().email({ message: "Votre email est invalide !" }),
    password: z.string().min(8, { message: "Votre mot de passe doit contenir 8 caractères minimum" })
});

export const SigninValidation = z.object({
    email: z.string().email({ message: "Votre email est invalide !" }),
    password: z.string().min(8, { message: "Votre mot de passe doit contenir 8 caractères minimum" })
});

export const AddNewWorkOutValidation = z.object({
    title: z.coerce.string().min(2, { message: "Trop court !" }),
    load: z.coerce.number(),
    reps: z.coerce.number(), 
    link: z.coerce.string()
});