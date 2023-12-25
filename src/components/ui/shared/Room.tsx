import { useWorkerContext } from '@/context/AuthContext';
import { useGetRecentMessages } from '@/lib/react-query/queries';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { appwriteConfig, client } from '@/lib/appwrite/config';



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

    console.log("worker", worker);

    useEffect(() => {
        setMessages(getRecentMessages?.documents);

        client.subscribe(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`, response => {
            // Callback will be executed on changes for documents A and all files.
            console.log("REAL TIME:",response);

            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                console.log("A MESSAGE WAS CREATED");
            }

            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                console.log("A MESSAGE WAS DELETED");
            }
        });

    }, [getRecentMessages])

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

        <div className="p-3 bg-slate-900 rounded">
            <div>
                {messages?.map(message => (
                    <div key={message.$id} className="flex flex-wrap flex-col gap-2 m-4">
                        <div className='flex justify-center items-center'>
                            <small className=' text-gray-00'>{message.$createdAt}</small>
                        </div>
                        <div className="p-4 bg-pink-600 rounded-3xl w-fit max-w-full break-words">
                            <span>{message.body}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Room