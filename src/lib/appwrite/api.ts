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

export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        console.error(error)
    }
}

export async function getCurrentWorker() {

    const currentAccount = getAccount();

    const worker = currentAccount
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(async (current: any) => {
            console.log("current api", current);
            const currentWorker = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.workersCollectionId,
                [Query.equal('workerId', current.$id)]
            )
            if (!currentWorker) throw Error;

            //console.log("currentWorker.documents api", currentWorker.documents);

            return currentWorker.documents[0];
        })
        .catch((err) => {
            console.error(err)
        })

    return worker;
}

export async function addNewExercice(exercice: IExerciceType) {

    try {
        const documentId = ID.unique();
        const currentWorker = await getCurrentWorker();
        const workerId = currentWorker?.workerId
        console.log("currentWorker", currentWorker?.workerId);


        const newExercice = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.exercicesCollectionId,
            documentId,
            {
                title: exercice.title,
                load: exercice.load,
                reps: exercice.reps,
                link: exercice.link === "" ? null : exercice.link,
                workers: [workerId]
            },
            [
                Permission.write(Role.user(workerId)),
                Permission.update(Role.user(workerId)),
                Permission.delete(Role.user(workerId))
            ]
        );

        return newExercice;



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