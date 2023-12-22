import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { IContextType } from '../types';
import { getCurrentWorker } from '../lib/appwrite/api'
import { INITIAL_WORKER } from "../constants";

const INITIAL_STATE = {
    worker: INITIAL_WORKER,
    isLoading: false,
    isAuthenticated: false,
    setWorker: () => { },
    setIsAuthenticated: () => { },
    checkAuthWorker: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkerContext = () => useContext(AuthContext)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [worker, setWorker] = useState(INITIAL_WORKER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate()

    const checkAuthWorker = async () => {
        setIsLoading(true);
        try {
            const currentAccount =  await getCurrentWorker();

            console.log('currentAccount AuthContext ', currentAccount);

            if (currentAccount) {
                setWorker({
                    id: currentAccount.$id,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    password:''
                })
                setIsAuthenticated(true);

                return true;
            }

            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (
            cookieFallback === '[]' ||
            cookieFallback === null ||
            cookieFallback === undefined 
        ) navigate('/sign-in');

        checkAuthWorker();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = {
        worker,
        setWorker,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthWorker
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider



