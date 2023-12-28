import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { appwriteConfig, databases } from "./appwrite/config";
import { Query } from "appwrite";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("fr-FR", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} à ${time}`;
}

export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `il y a ${Math.floor(diffInDays)} jours`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `il y a ${Math.floor(diffInDays)} jours`;
    case Math.floor(diffInHours) >= 1:
      return `il y a ${Math.floor(diffInHours)} heures`;
    case Math.floor(diffInMinutes) >= 1:
      return `il y a ${Math.floor(diffInMinutes)} minutes`;
    default:
      return "A l'instant";
  }
};
// Fonction pour vérifier si une date est aujourd'hui
export function isToday(date: string) {
  const currentDate = new Date();
  const providedDate = new Date(date);

  return (
    currentDate.getDate() === providedDate.getDate() &&
    currentDate.getMonth() === providedDate.getMonth() &&
    currentDate.getFullYear() === providedDate.getFullYear()
  );
}

export function describeDate(inputDate: string) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const input = new Date(inputDate);
  input.setHours(0, 0, 0, 0);

  switch (true) {
    case input.getTime() === today.setHours(0, 0, 0, 0):
      return "Aujourd'hui";
      break;
    case input.getTime() === yesterday.setHours(0, 0, 0, 0):
      return "Hier";
      break;
    case input.getTime() === twoDaysAgo.setHours(0, 0, 0, 0):
      return input.toLocaleDateString("fr-FR", { weekday: "long" });
      break;
    case input.getTime() === threeDaysAgo.setHours(0, 0, 0, 0):
      return input.toLocaleDateString("fr-FR", { weekday: "long" });
      break;

    default:
      return input.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      break;
  }
}

export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// Fonction pour formater l'heure du message
export function formatHourString(createdAt: string) {
  const date = new Date(createdAt);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getWorkerByWorkerId(workerId: string) {
  try {
    const response = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workersCollectionId,
      [Query.equal("workerId", workerId)],
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPreviousMessageFromOtherDay = (
  predecessor: {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    body: string;
    user_id: string;
    username: string;
  } | null,
  message: {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    body: string;
    user_id: string;
    username: string;
  },
) => {
  if (!predecessor) {
    return false;
  }

  //console.log('predecessor', predecessor);
  //console.log("message isprevious...", message)

  const prevDate = new Date(predecessor.$createdAt).getDay();
  const currentDate = new Date(message.$createdAt).getDay();
  return prevDate == currentDate;
};

export const isPredecessorSameAuthor = (
  predecessor: {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    body: string;
    user_id: string;
    username: string;
  } | null,
  message: {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    body: string;
    user_id: string;
    username: string;
  },
): boolean => {
  if (!predecessor) {
    return false;
  }
  return predecessor.user_id === message.user_id;
};
