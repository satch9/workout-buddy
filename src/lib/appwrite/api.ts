import { ID, Query, Permission, Role } from 'appwrite';
import { account, appwriteConfig, databases } from './config';
import { INewWorker } from '../../types';

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

        /* const newWorkerId = newWorker.$id;
        const userID = newWorkerId;

        const updatedExercices = {
            workers: userID
        }

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.exercicesCollectionId,
            newWorkerId,
            updatedExercices
        ); */



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

export async function getCurrentWorker() {
    try {

        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentWorker = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.workersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentWorker) throw Error;

        return currentWorker.documents[0];

    } catch (error) {
        console.error(error)
    }
}