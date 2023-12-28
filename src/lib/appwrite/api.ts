import { ID, Query, Permission, Role } from "appwrite";
import { account, appwriteConfig, databases } from "./config";
import { IExerciceType, IMessageType, INewWorker } from "../../types";

export async function createWorkerAccount(worker: INewWorker) {
  try {
    const newAccountId = ID.unique();

    const newAccount = await account.create(
      newAccountId,
      worker.email,
      worker.password,
      worker.username,
    );

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
    console.error(error);
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
    console.log(
      "appwriteConfig.workersCollectionId API",
      appwriteConfig.workersCollectionId,
    );
    console.log("documentId API", documentId);

    const newWorker = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workersCollectionId,
      documentId,
      worker,
      [Permission.write(Role.any())],
    );

    return newWorker;
  } catch (error) {
    console.error(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    console.log("user.email", user.email);
    console.log("user.password", user.password);

    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSessions();

    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentWorker() {
  try {
    const currentAccount = await getAccount();

    console.log("currentAccount", currentAccount);

    if (!currentAccount) throw Error;

    const currentWorker = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workersCollectionId,
      [Query.equal("workerId", currentAccount?.$id)],
    );

    if (!currentWorker) throw Error;

    //console.log("api currentWorker.documents[0]",currentWorker.documents)

    return currentWorker.documents[0];
  } catch (error) {
    console.error(error);
  }
}

export async function addNewExercice(exercice: IExerciceType) {
  try {
    const documentId = ID.unique();
    const currentWorker = await getCurrentWorker();
    const workerId = currentWorker?.$id;
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
        workers: workerId,
      },
      [
        Permission.write(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ],
    );

    return newExercice;
  } catch (error) {
    console.error(error);
  }
}

export async function getExercices() {
  const currentWorker = await getCurrentWorker();
  const workerId = currentWorker?.$id;

  if (!workerId) throw Error;

  try {
    const exercices = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.exercicesCollectionId,
      [Query.equal("workers", workerId)],
    );

    console.log("exercices api", exercices);
    return exercices;
  } catch (error) {
    console.log(`${error} depuis getExercices api`);
  }
}

export async function getRecentExercices() {
  const currentWorker = await getCurrentWorker();
  const workerId = currentWorker?.$id;

  if (!workerId) throw Error;

  const exercices = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.exercicesCollectionId,
    [Query.orderDesc("$createdAt"), Query.equal("workers", workerId)],
  );

  if (!exercices) throw Error;

  return exercices;
}

export async function deleteExercice(exerciceId: string) {
  if (!exerciceId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.exercicesCollectionId,
      exerciceId,
    );

    if (!statusCode) throw Error;

    return { statusCode: "OK" };
  } catch (error) {
    console.error(error);
  }
}

export async function getMessages() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function createMessage(message: IMessageType) {
  try {
    const currentWorker = await getCurrentWorker();

    console.log("currentWorker", currentWorker);

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        body: message.body,
        user_id: currentWorker?.$id,
        username: currentWorker?.username,
      },
      [
        Permission.write(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ],
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentMessages() {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.messagesCollectionId,
    [Query.orderAsc("$createdAt")],
  );

  if (!response) throw Error;

  return response;
}

export async function deleteMessage(messageId: string) {
  if (!messageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId,
    );

    if (!statusCode) throw Error;

    return { statusCode: "OK" };
  } catch (error) {
    console.error(error);
  }
}
