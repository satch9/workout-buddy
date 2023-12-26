import { useWorkerContext } from '@/context/AuthContext';
import { useGetRecentMessages } from '@/lib/react-query/queries';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { appwriteConfig, client } from '@/lib/appwrite/config';
import { capitalizeFirstLetter, formatHourString, isPredecessorSameAuthor, isPreviousMessageFromOtherDay, isToday } from '@/lib/utils';

import { Badge } from "@/components/ui/badge"

const Room = () => {

    const {
        data: getRecentMessages,
        isPending: isMessagesLoading,
        isError: isErrorMessages
    } = useGetRecentMessages();



    //const { mutateAsync: createMessage } = useAddNewMessage();

    const { worker } = useWorkerContext()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[] | undefined>([]);



    useEffect(() => {
        //setMessages(getRecentMessages?.documents || []);

        const unsubscribe = client.subscribe(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`, response => {

            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log("A MESSAGE WAS CREATED");
                console.log("REAL TIME:", response.payload);

                setMessages(prevState => {
                    if (prevState !== undefined && Array.isArray(prevState)) {
                        return [response.payload, ...prevState];
                    } else {
                        // Gérez le cas où prevState est undefined ou autre chose
                        return [response.payload]
                    }

                })
            }

            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                console.log("A MESSAGE WAS DELETED");
            }
        });

        return () => {
            // Assurez-vous de vous désabonner lorsque le composant est démonté
            unsubscribe();
        };


    }, [getRecentMessages, appwriteConfig.databaseId, appwriteConfig.messagesCollectionId])

    if (isMessagesLoading) {
        // Loading state
        return <Loader />;
    }

    if (isErrorMessages) {
        // Error state
        return (
            <div>Quelque chose ne fonctionne pas dans la récupération des messages.</div>
        );
    }


    return (

        <div className="p-3 bg-slate-900 rounded overflow-y-auto max-h-96">
            <div className=''>
                {/* {
                    messages?.map(message => (
                        <div key={message.$id} className="flex flex-col m-4 ">
                            <div className="flex items-center mb-1">
                                {message?.user_id === worker.id ? (
                                    <span className="font-semibold text-blue-500">
                                        {capitalizeFirstLetter(worker.username)}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">Anonyme</span>
                                )}

                            </div>
                            <div
                                className={`rounded-lg relative p-3 ${message?.user_id === worker.id
                                    ? 'bg-pink-600 self-end'
                                    : 'bg-gray-500'
                                    }`}
                            >
                                <span className="text-white-800">{message.body}</span>
                                <small className="text-gray-300 absolute bottom-0 right-0 text-xs p-1">
                                    {formatHourString(message.$createdAt)}
                                </small>
                                <span
                                    className={`absolute top-0 right-0 text-xs px-2 py-1 }`}
                                >
                                    {isToday(message.$createdAt) ? 'Aujourd\'hui' : 'Hier'}
                                </span>
                            </div>
                        </div>
                    ))
                } */}

                {
                    messages?.map((message, index: number) => {


                        const predecessor = index - 1 >= 0 ? messages[index - 1] : null;
                        //console.log("message",message);

                        return (
                            <div key={message.$id} className="flex flex-col">
                                {
                                    isPreviousMessageFromOtherDay(predecessor, message) ? (
                                        ""
                                    ) : (
                                        <Badge
                                            key={index}
                                            className={` text-xs px-2  }`}
                                        >
                                            {isToday(message.$createdAt) ? "Aujourd'hui" : 'Hier'}
                                        </Badge>
                                    )
                                }


                                {!isPredecessorSameAuthor(predecessor, message) && (
                                    <div
                                        className={`flex items-center mb-1 ${message?.user_id === worker.id
                                            ? 'self-end' :
                                            'self-start'
                                            }`}
                                    >
                                        <span className={`font-semibold  ${message?.user_id === worker.id
                                            ? 'text-blue-500'
                                            : 'text-white'
                                            }`}>
                                            {message.user_id === worker.id ? capitalizeFirstLetter(worker.username) : (message.username)}
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`rounded-lg relative p-3 mb-2 ${message?.user_id === worker.id
                                        ? 'bg-pink-600 w-2/3 self-end'
                                        : 'bg-gray-500 w-2/3'
                                        }`}
                                >

                                    <span className="text-white-800 mb-2 text-sm">{message.body}</span>
                                    <small className="text-gray-300 absolute bottom-0 right-0 text-xs p-1 mt-4">
                                        {formatHourString(message.$createdAt)}
                                    </small>

                                </div>
                            </div>
                        );
                    })}
            </div >

        </div >


    )
}

export default Room