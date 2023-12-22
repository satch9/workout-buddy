import { Link } from "react-router-dom";
import { FaTrashCan } from "react-icons/fa6";
import { IExerciceType } from "@/types";

const WorkOutDetails = (exercice: IExerciceType) => {

  if(!exercice.title) return;

  const handleDelete = async (exercices:IExerciceType ) => {
    console.log("delete exercices", exercices);
    
  }

  return (
    <div className="bg-white rounded mt-3 mb-3  mr-10 p-5 shadow-lg relative">
      <h4 className="text-light-4"><strong>{exercice.title}</strong></h4>
      <p className="text-light-4"><strong>{exercice.load}</strong></p>
      <p className="text-light-4"><strong>{exercice.reps}</strong></p>
      <p className="text-light-4">Regarder le tuto <Link to={exercice.link}><strong>Ici</strong></Link></p>
      <p className="text-light-4">Enregistré le </p>
      <span className="absolute cursor-pointer top-5 right-5 p-1 rounded h-6 bg-white">
        <FaTrashCan color="black" height={25} onClick={handleDelete(exercice)} />
      </span>
    </div>
  )
}

export default WorkOutDetails