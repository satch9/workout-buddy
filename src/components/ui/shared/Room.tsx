import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { FaTrashCan } from "react-icons/fa6";

import { useWorkerContext } from "@/context/AuthContext";
import {
  useDeleteMessage,
  useGetRecentMessages,
} from "@/lib/react-query/queries";

import { appwriteConfig, client } from "@/lib/appwrite/config";
import {
  capitalizeFirstLetter,
  formatHourString,
  isPredecessorSameAuthor,
  isPreviousMessageFromOtherDay,
  describeDate,
} from "@/lib/utils";

import Loader from "./Loader";

const Room = () => {
  const {
    data: getRecentMessages,
    isPending: isMessagesLoading,
    isError: isErrorMessages,
  } = useGetRecentMessages();

  const { mutateAsync: deleteMessage } = useDeleteMessage();

  //const { mutateAsync: createMessage } = useAddNewMessage();

  const { worker } = useWorkerContext();
  const messageEl = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[] | undefined>([]);

  const scrollToBottom = () => {
    messageEl.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(getRecentMessages?.documents || []);
    //console.log("messages", messages);

    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create",
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          console.log("REAL TIME:", response.payload);

          setMessages((prevState) => {
            if (prevState !== undefined && Array.isArray(prevState)) {
              return [response.payload, ...prevState];
            } else {
              // Gérez le cas où prevState est undefined ou autre chose
              return [response.payload];
            }
          });
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete",
          )
        ) {
          console.log("A MESSAGE WAS DELETED");
          setMessages((prevState) => {
            if (prevState !== undefined && Array.isArray(prevState)) {
              prevState.filter(
                (message) =>
                  (message as { $id: string }).$id !==
                  (response.payload as { $id: string }).$id,
              );
            } else {
              return [response.payload as { $id: string }];
            }
          });
        }
      },
    );

    return () => {
      // Assurez-vous de vous désabonner lorsque le composant est démonté
      unsubscribe();
    };
  }, [getRecentMessages]);

  if (isMessagesLoading) {
    // Loading state
    return <Loader />;
  }

  if (isErrorMessages) {
    // Error state
    return (
      <div>
        Quelque chose ne fonctionne pas dans la récupération des messages.
      </div>
    );
  }

  return messages?.length === 0 ? (
    <div className="text-center uppercase">Pas de messages !!!</div>
  ) : (
    <div className="p-3 bg-slate-900 rounded overflow-y-auto max-h-96">
      <div>
        {messages?.map((message, index: number) => {
          const predecessor = index - 1 >= 0 ? messages[index - 1] : null;
          //console.log("message",message);

          return (
            <div key={message.$id} className="flex flex-col">
              {isPreviousMessageFromOtherDay(predecessor, message) ? (
                ""
              ) : (
                <Badge
                  key={index}
                  className={` text-xs px-2 bg-white text-black flex justify-center mt-5 mb-5 w-24 mx-auto p-1 hover:not(:hover)}`}
                >
                  {describeDate(message.$createdAt)}
                </Badge>
              )}

              {!isPredecessorSameAuthor(predecessor, message) && (
                <div
                  className={`flex items-center mb-1 ${
                    message?.user_id === worker.id ? "self-end" : "self-start"
                  }`}
                >
                  <span
                    className={`font-semibold  ${
                      message?.user_id === worker.id
                        ? "text-blue-500"
                        : "text-white"
                    }`}
                  >
                    {message.user_id === worker.id
                      ? capitalizeFirstLetter(worker.username)
                      : message.username}
                  </span>
                  {message.user_id === worker.id ? (
                    <FaTrashCan
                      className="ml-2"
                      onClick={() => {
                        deleteMessage(message.$id);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              )}
              <div
                className={`rounded-lg relative p-3 mb-2  overflow-hidden  ${
                  message?.user_id === worker.id
                    ? "bg-pink-600 w-3/4 self-end"
                    : "bg-gray-500 w-3/4 self-start"
                }`}
              >
                <div className="text-white-800 mb-2 text-sm ">
                  {message.body}
                </div>
                <div ref={messageEl}></div>

                <small className="text-gray-300 absolute bottom-0 right-0 text-xs p-1 mt-4">
                  {formatHourString(message.$createdAt)}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Room;
