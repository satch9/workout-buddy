import { Link, useNavigate } from "react-router-dom";
import { useWorkerContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { TbLogout } from "react-icons/tb";
import { IoChatbox } from "react-icons/io5";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import NewMessageForm from "@/_root/forms/NewMessageForm";
import Room from "./Room";


const NavBar = () => {
    const { worker } = useWorkerContext();
    const navigate = useNavigate()
    const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
    const { toast } = useToast();
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        if (isSuccess) {
            toast({ title: "Déconnexion réussie !" })
            navigate("/sign-in");
        }
    }, [isSuccess, navigate]);

    const incrementUnreadMessages = ()  => {

        setUnreadMessages((prevCount: number) => {
            return prevCount + 1
        });
    };

    return (
        <div className="container">
            <nav className="flex items-center p-3 mb-3 bg-light-4 justify-between ">


                <div className="flex items-center">
                    <Link to="/">
                        <img src="/assets/images/logo.jpg" alt="logo" width={32}
                            height={32}
                            className='rounded-full mr-3' />

                    </Link>
                    <Link to="/"><h1 className="invisible md:visible sm:text-xl">Workout-Buddy</h1></Link>
                </div>

                {
                    worker &&
                    <div className="flex items-center justify-end">
                        <p className="mr-3 sm:text-xl">{worker.username}</p>
                        <div className="flex items-center mr-3 relative"> {/* Use a wrapper div */}
                            <Sheet key={"right"}>
                                <SheetTrigger>
                                <div
                                        onClick={() => {
                                            // Mark messages as read when the icon is clicked
                                            setUnreadMessages(0);
                                        }}
                                    >
                                        <IoChatbox className="w-6 h-6" />
                                        {unreadMessages > 0 && (
                                            <div className="bg-red text-white absolute -top-1 -right-1 rounded-full w-4 h-4 flex items-center justify-center ">
                                                {unreadMessages}
                                            </div>
                                        )}
                                    </div>
                                </SheetTrigger>

                                <SheetContent className="bg-slate-500">
                                    <SheetHeader>
                                        <SheetTitle>Chat entre workers</SheetTitle>
                                    </SheetHeader>
                                    <NewMessageForm incrementUnreadMessages={incrementUnreadMessages} />
                                    <Room />
                                </SheetContent>
                            </Sheet>
                        </div>
                        <TbLogout className="w-6 h-6" onClick={() => signOut()} />
                    </div>
                }




            </nav>

        </div>
    )
}

export default NavBar;
