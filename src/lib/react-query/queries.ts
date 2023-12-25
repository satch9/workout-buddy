import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query"

import { 
    createWorkerAccount, 
    signInAccount, 
    signOut, 
    addNewExercice, 
    getExercices, 
    getRecentExercices,
    deleteExercice, 
    getMessages,
    createMessage
} from "../appwrite/api"
import { INewWorker } from "@/types";
import { QUERY_KEYS } from "./queryKey";

export const useCreateWorkerAccount = () => {
    return useMutation({
        mutationFn: (worker: INewWorker) => createWorkerAccount(worker)
    });
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string
        }) => signInAccount(user),
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: () => signOut(),
    })
}

export const useAddNewWorkOut = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (exercice: {
            title: string;
            load: number;
            reps: number;
            link: string;
        }) => addNewExercice(exercice),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_EXERCICES]
            })
        }
    })
}

export const useGetExercices = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => getExercices(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_EXERCICES]
            })
        }
    })

}

export const useGetRecentExercices = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_EXERCICES],
        queryFn: getRecentExercices,
    });
}

export const useDeleteExercice =()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (exerciceId: string)=> deleteExercice(exerciceId),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_EXERCICES]
            })
        }
    })
}

export const useGetMessages = ()=>{
    return useMutation({
        mutationFn: () => getMessages(),
    })
}

export const useAddNewMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (message: {
            body: string;
        }) => createMessage(message),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_MESSAGES]
            })
        }
    })
}