export type IWorker = {
    id: string;
    username: string;
    email: string;
    password: string;
}

export type INewWorker = {
    username: string;
    email: string;
    password: string;
}

export type IContextType = {
    worker: IWorker;
    isLoading: boolean;
    setWorker: React.Dispatch<React.SetStateAction<IWorker>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthWorker: () => Promise<boolean>;
}