import { Outlet } from 'react-router';
import NavBar from './../components/ui/shared/NavBar';


const RootLayout = () => {
    return (
        <div className="w-full md:flex flex-col">
            <NavBar />

            <section className='flex flex-1 h-full'>
                <Outlet />
            </section>
            
        </div>
    )
}

export default RootLayout
