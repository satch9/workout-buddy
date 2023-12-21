import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavBar = () => {
    return (
        <div className="container">
        <nav className="flex items-center p-3 mb-3 bg-light-4 justify-between ">

            <div className="flex items-center w-2/3">
                <img src="../../../public/assets/images/logo.jpg" alt="logo" width={32}
                    height={32}
                    className='rounded-full mr-3' />
                <h1><Link to="/">Workout-Buddy</Link></h1>
            </div>

            <div className="flex items-center  w-1/3 justify-end">
                <Button type="submit" className="shad-button_dark_4 mr-4" >
                    enregistrer
                </Button>
                <Button type="submit" className="shad-button_dark_4">
                    connecter
                </Button>
            </div>

        </nav>
        </div> 
    )
}

export default NavBar