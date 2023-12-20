import {

    useMutation,

} from "@tanstack/react-query"

import { createWorkerAccount, signInAccount } from "../appwrite/api"
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