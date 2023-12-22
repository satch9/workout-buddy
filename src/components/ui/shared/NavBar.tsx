import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWorkerContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useEffect } from "react";

const NavBar = () => {
    const { worker } = useWorkerContext();
    const navigate = useNavigate()
    const { mutateAsync: signOutAccount, isSuccess } = useSignOutAccount();


    useEffect(() => {
        if (isSuccess) navigate(0)
    }, [isSuccess, navigate]);

    return (
        <div className="container">
            <nav className="flex items-center p-3 mb-3 bg-light-4 justify-between ">

                <div className="flex items-center w-2/3">
                    <Link to="/">
                        <img src="/assets/images/logo.jpg" alt="logo" width={32}
                            height={32}
                            className='rounded-full mr-3' />
                        <h1>Workout-Buddy</h1>
                    </Link>
                </div>

                {worker ? <div className="flex items-center  w-1/3 justify-end">
                    <Button type="submit" className="shad-button_dark_4" onClick={() => signOutAccount()}>
                        déconnecter
                    </Button>
                </div> : <div className="flex items-center  w-1/3 justify-end">
                    <Button type="submit" className="shad-button_dark_4 mr-4" >
                        enregistrer
                    </Button>
                    <Button type="submit" className="shad-button_dark_4">
                        connecter
                    </Button>
                </div>}


            </nav>
        </div>
    )
}

export default NavBar