import { ID, Query, Permission, Role } from 'appwrite';
import { account, appwriteConfig, databases } from './config';
import { IExerciceType, INewWorker } from '../../types';

export async function createWorkerAccount(worker: INewWorker) {
    try {
        const newAccountId = ID.unique();

        const newAccount = await account.create(
            newAccountId,
            worker.email,
            worker.password,
            worker.username
        )

        console.log("newAccount API", newAccount);

        if (!newAccount) throw Error;

        const newWorker = await saveWorkerDB({
            workerId: newAccount.$id,
            username: worker.username,
            email: worker.email,
        });

        console.log("newWorker API", newWorker);

        return newWorker;

    } catch (error) {
        console.error(error)
    }
}

export async function saveWorkerDB(worker: {
    workerId: string;
    username: string;
    email: string;
}) {
    try {
        const documentId = ID.unique();

        console.log("appwriteConfig.databaseId API", appwriteConfig.databaseId);
        console.log("appwriteConfig.workersCollectionId API", appwriteConfig.workersCollectionId);
        console.log("documentId API", documentId);

        const newWorker = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workersCollectionId,
            documentId,
            worker,
            [
                Permission.write(Role.any())
            ]
        )

        return newWorker;

    } catch (error) {
        console.error(error)
    }
}

export async function signInAccount(worker: { email: string; password: string; }) {
    try {
        const session = await account.createEmailSession(worker.email, worker.password)

        return session;
    } catch (error) {
        console.error(error)
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current")

        return session;
    } catch (error) {
        console.error(error)
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        console.error(error)
    }
}

export async function getCurrentWorker() {

    const currentAccount = await getAccount();

    //console.log('currentAccount', currentAccount);

    const currentWorker = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.workersCollectionId,
        [Query.equal("workerId", currentAccount!.$id)]
    );

    if(!currentWorker) throw Error;

    //console.log("api currentWorker.documents[0]",currentWorker.documents)

    return currentWorker.documents[0];

}

export async function addNewExercice(exercice: IExerciceType) {

    try {
        const documentId = ID.unique();
        const currentWorker = await getCurrentWorker();
        const workerId = currentWorker?.$id
        console.log("currentWorker", workerId);


        const newExercice = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.exercicesCollectionId,
            documentId,
            {
                title: exercice.title,
                load: exercice.load,
                reps: exercice.reps,
                link: exercice.link === "" ? null : exercice.link,
                workers: workerId
            },
            [
                Permission.write(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any())
            ]
        );

        return newExercice;

    } catch (error) {
        console.error(error)
    }
}

export async function getExercices(workerId:string){
    
    if(!workerId) throw Error;
    
    try {
        const exercices = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.exercicesCollectionId,
            [Query.equal("workers", workerId)]
        )

        console.log("exercices api", exercices);
        return exercices;
    } catch (error) {
        console.error(error);
    }
}