import NewWorkOutForm from "../forms/NewWorkOutForm";
import WorkOutDetails from "@/components/ui/shared/WorkOutDetails";

import { AiOutlinePlusCircle } from "react-icons/ai";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const Home = () => {
  return (
    <div className="flex flex-col  container lg:flex-row">
      <section className="sm:w-full lg:w-2/3 ">
        <div className="w-full relative">
          <WorkOutDetails />
          <Dialog>
            <DialogTrigger>
              <AiOutlinePlusCircle
                onClick={() => console.log("ajouter un nouveau workout")}
                className=" rounded-full w-14 h-14  sm:invisible md:visible lg:invisible  fixed top-20  right-3 z-10"
                color="#db2777"
              />
            </DialogTrigger>
            <DialogContent className="bg-slate-700">
              <DialogHeader>
                <NewWorkOutForm />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="w-full lg:w-1/3 invisible sm:visible md:invisible lg:visible">
        <NewWorkOutForm />
      </section>
    </div>
  );
};

export default Home;
