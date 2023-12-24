import { Link, useNavigate } from "react-router-dom";
import { useWorkerContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"
import { TbLogout } from "react-icons/tb";

const NavBar = () => {
    const { worker } = useWorkerContext();
    const navigate = useNavigate()
    const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
    const { toast } = useToast()

    useEffect(() => {
        if (isSuccess) {
            toast({title:"Déconnexion réussie !"})
            navigate("/sign-in");
        }
    }, [isSuccess, navigate]);

    return (
        <div className="container">
            <nav className="flex items-center p-3 mb-3 bg-light-4 justify-between ">

                <div className="flex items-center">
                    <Link to="/">
                        <img src="/assets/images/logo.jpg" alt="logo" width={32}
                            height={32}
                            className='rounded-full mr-3' />
                        
                    </Link>
                    <Link  to="/"><h1 className="invisible md:visible sm:text-xl">Workout-Buddy</h1></Link>
                </div>

                {
                    worker &&
                        <div className="flex items-center justify-end">
                            <p className="mr-3 sm:text-xl">Bienvenue {worker.username}</p>
                            <TbLogout className="w-6 h-6" onClick={() => signOut()}/>
                        </div> 
                }


            </nav>

        </div>
    )
}

export default NavBar