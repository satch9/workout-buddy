import NewWorkOutForm from "../forms/NewWorkOutForm"

const Home = () => {

    /* const {
        data: exercices,
        isLoading: isExercicesLoading,
        isError: isErrorExercices,
      } = useGetExercices();

      if(isErrorExercices || isExercicesLoading ){
        return (
            <div className="flex flex-col container sm:flex-row">
                <section className="w-full sm:w-2/3 p-3">
                    Quelque chose ne va pas
                </section>
                <section className="w-full sm:w-1/3">
                    <NewWorkOutForm/>
                </section>
            </div>
        )
      } */

    return (
        <div className="flex flex-col container sm:flex-row">
            <section className="w-full sm:w-2/3 p-3">
                
            </section>
            <section className="w-full sm:w-1/3">
                <NewWorkOutForm/>
            </section>
        </div>
    )
}

export default Home
