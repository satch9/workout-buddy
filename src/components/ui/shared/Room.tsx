import { useWorkerContext } from '@/context/AuthContext';
import { useGetMessages } from '@/lib/react-query/queries';
import { useEffect, useState } from 'react';



const Room = () => {

    const { mutateAsync: getMessages } = useGetMessages();
    const { worker } = useWorkerContext()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[] | undefined>([]);


    useEffect(() => {
        getMessages().then((mess) => {
            console.log("mess", mess)
            setMessages(mess?.documents)
        })
    }, [getMessages])

    console.log("worker", worker)

    const handleSubmit = async (e: { preventDefault: () => void; })=>{
        e.preventDefault();

        let response
    }

    return (
        <main>
            <div className="p-5 mr-10 bg-slate-900 rounded">
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
        </main>
    )
}

export default Room