import { useGetExercices } from "@/lib/react-query/queries";
import NewWorkOutForm from "../forms/NewWorkOutForm"

import { useWorkerContext } from "@/context/AuthContext";
import WorkOutDetails from "@/components/ui/shared/WorkOutDetails";


const Home = () => {
    let exercices;
    const { worker } = useWorkerContext();
    const {
        mutateAsync: getExercices,
        isPending: isExercicesLoading,
        isError: isErrorExercices,
    } = useGetExercices();

    if (isErrorExercices || isExercicesLoading) {
        return (
            <div className="flex flex-col container sm:flex-row">
                <section className="w-full sm:w-2/3 p-3">
                    Quelque chose ne va pas
                </section>
                <section className="w-full sm:w-1/3">
                    <NewWorkOutForm />
                </section>
            </div>
        )
    }

    console.log("workerId", worker.id)


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getExercices(worker.id).then((exo:any) => {
        console.log(exo.documents)
        exercices = exo.documents
    })
    console.log("exercices",exercices)

    return (
        <div className="flex flex-col container sm:flex-row">
            <section className="w-full sm:w-2/3 p-3">
               <WorkOutDetails exercices={exercices} /> 
            </section>
            <section className="w-full sm:w-1/3">
                <NewWorkOutForm />
            </section>
        </div>
    )
}

export default Home
