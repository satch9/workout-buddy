import {

    useMutation,

} from "@tanstack/react-query"

import { createWorkerAccount, signInAccount, signOutAccount, addNewExercice, getExercices } from "../appwrite/api"
import { INewWorker } from "@/types";

export const useCreateWorkerAccount = () => {
    return useMutation({
        mutationFn: (worker: INewWorker) => createWorkerAccount(worker)
    });
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (player: {
            email: string;
            password: string
        }) => signInAccount(player),
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: () => signOutAccount(),
    })
}

export const useAddNewWorkOut = () => {
    return useMutation({
        mutationFn: (exercice: {
            title: string;
            load: number;
            reps: number;
            link: string;
        }) => addNewExercice(exercice),
    })
}

export const useGetExercices = () => {
    return useMutation({
        mutationFn: (workerId: string) => getExercices(workerId),
    })
}