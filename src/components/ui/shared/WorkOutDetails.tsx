import { Link } from "react-router-dom";
import { FaTrashCan } from "react-icons/fa6";
import {
  useDeleteExercice,
  useGetRecentExercices,
} from "@/lib/react-query/queries";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { Models } from "appwrite";
import { multiFormatDateString } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useWorkerContext } from "@/context/AuthContext";

const WorkOutDetails = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [exercices, setExercices] = useState<any[] | undefined>([]);
  const {
    data: getRecentExercices,
    isPending: isExercicesLoading,
    isError: isErrorExercices,
  } = useGetRecentExercices();

  const { mutateAsync: deleteExercice } = useDeleteExercice();
  const { toast } = useToast();
  const { worker } = useWorkerContext();

  useEffect(() => {
    console.log("getRecentExercices", getRecentExercices);
    setExercices(getRecentExercices?.documents);
  }, [getRecentExercices]);

  console.log("exercices", exercices);
  console.log("worker", worker);

  if (isExercicesLoading) {
    // Loading state
    return <Loader />;
  }

  if (isErrorExercices) {
    // Error state
    return (
      <div>
        Quelque chose ne fonctionne pas dans la récupération de vos exercices.
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (exerciceId: any) => {
    console.log("delete exercice", exerciceId);
    const status = deleteExercice(exerciceId);

    status.then((stat) => {
      console.log(stat?.statusCode);
      if (stat?.statusCode === "OK") {
        toast({ title: "Exercice supprimé!" });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
      {exercices?.map((exercice: Models.Document, index) => (
        <div
          className="bg-white rounded mt-3 mb-3  mr-10 p-5 shadow-lg relative"
          key={index}
        >
          <h4 className="text-light-4">
            <strong>{exercice.title}</strong>
          </h4>
          <p className="text-light-4">
            <strong>Charge : {exercice.load} kg</strong>
          </p>
          <p className="text-light-4">
            <strong>Répétition : {exercice.reps} </strong>
          </p>
          {exercice.link ? (
            <p className="text-light-4">
              Regarder le tuto{" "}
              <Link target={"_blank"} to={`${exercice.link}`}>
                <strong>Ici</strong>
              </Link>
            </p>
          ) : (
            <p>Pas de vidéo</p>
          )}
          <p className="text-light-4">
            Enregistré {`${multiFormatDateString(exercice.$createdAt)}`}
          </p>
          <span className="absolute cursor-pointer top-5 right-5 p-1 rounded h-6 bg-white">
            <FaTrashCan
              color="black"
              height={25}
              onClick={() => handleDelete(exercice.$id)}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default WorkOutDetails;
