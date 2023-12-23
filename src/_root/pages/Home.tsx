import NewWorkOutForm from "../forms/NewWorkOutForm"
import WorkOutDetails from "@/components/ui/shared/WorkOutDetails";

const Home = () => {

    return (
        <div className="flex flex-col container sm:flex-row">
            <section className="w-full sm:w-2/3 p-3">
               <WorkOutDetails  /> 
            </section>
            <section className="w-full sm:w-1/3">
                <NewWorkOutForm />
            </section>
        </div>
    )
}

export default Home
